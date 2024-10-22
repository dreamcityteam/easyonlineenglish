import express, { Response, Request, Express } from 'express';
import nodemailer from 'nodemailer';
import mongoose, { ObjectId } from 'mongoose';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import { put } from '@vercel/blob';
import { HTTP_STATUS_CODES, INITIAL_COURSE, ROLE } from './consts';
import { Cookie, ResponseSend, Token, Location, TryCatch, SendEmailProps, UploadBlodToVercelProps, RequestType } from './type';
import User from '../schemas/user.schema';
import StudentPayment from '../schemas/studentPayment.schema';
import Course from '../schemas/course.schema';
import CourseWord from '../schemas/courseWord.schema';
import Library from '../schemas/library.schema';
import courseWords from './courseWords.json';
import libraries from './libraries.json';

const {
  NODE_ENV = '',
  MONGODB_URI_PRODUCTION = '',
  MONGODB_URI_DEVELOPMENT = '',
  ACCESS_KEY_TOKEN = '',
  ADMIN_USERNAME = '',
  ADMIN_NAME = '',
  ADMIN_LASTNAME = '',
  ADMIN_EMAIL = '',
  ADMIN_PHONE = '',
  ADMIN_PASSWORD = '',
  TOKEN_NAME = '',
  EMAIL_HOST = '',
  EMAIL_PORT = '',
  EMAIL_USER = '',
  EMAIL_PASS = ''
} = process.env;

/**
 * Checks if the environment is in development mode.
 * @returns {boolean} - True if in development mode, otherwise false.
 */
const isDev = (): boolean =>
  !!(NODE_ENV && NODE_ENV.includes('DEVELOPMENT'));

/**
 * Serves the application in production mode by setting up static file serving 
 * and handling any unmatched routes to return the index.html file.
 * @returns {void}
 */
const serveApp = (app: Express): void => {
  const BUILD_PATH: string = '../build';

  app.use(express.static(path.join(__dirname, BUILD_PATH)));
  app.get('*', (_: Response, res: Request) =>
    // @ts-ignore
    res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'))
  );
};

let isConnected: any;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const MONGODB_URI: string = isDev()
      ? MONGODB_URI_DEVELOPMENT
      : MONGODB_URI_PRODUCTION;

    await mongoose.connect(MONGODB_URI, {
      minPoolSize: 1,
      maxPoolSize: 1,
    });
    isConnected = mongoose.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

/**
 * Hashing utility for creating and comparing hashed values.
 */
const hash = {
  /**
   * Creates a hash from a given value.
   * @param {string} value - Value to hash.
   * @returns {Promise<string>} - Hashed value.
   */
  create: async (value: string): Promise<any> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  },

  /**
   * Compares a password with a hashed value.
   * @param {Object} param
   * @param {string} param.password - Plain text password.
   * @param {string} param.hash - Hashed value.
   * @returns {Promise<boolean>} - True if the password matches the hash, otherwise false.
   */
  compare: async ({ password, hash }: { password: string; hash: string; }): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error comparing hash:', error);
      return false;
    }
  },
};

/**
 * Initial Mongo database.
 *
 * @returns {Promise<void>}
 */
const initialDatabase = async (): Promise<void> => {
  try {
    let admin = await User.findOne({ username: 'admin' });

    if (!admin) {
      admin = await User.create({
        username: ADMIN_USERNAME,
        name: ADMIN_NAME,
        lastname: ADMIN_LASTNAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: await hash.create(ADMIN_PASSWORD),
        role: ROLE.ADMIN,
      });
      console.log('Admin inserted successfully');
    } else {
      console.log('Admin already exists.');
    }

    let course = await Course.findOne({ title: 'Inglés Conversacional' });

    if (!course) {
      course = await Course.create({
        picture: INITIAL_COURSE.PICTURE,
        title: INITIAL_COURSE.TITLE,
        description: INITIAL_COURSE.DESCRIPTION,
      });

      console.log('Course inserted successfully');

      const words = courseWords.map((courseWord) => ({
        ...courseWord,
        idCourse: String(course?._id),
      }));

      await CourseWord.insertMany(words);
      console.log('Words inserted successfully');
    } else {
      console.log('Course already exists.');
    }

    const existingLibrary = await Library.findOne();

    if (!existingLibrary) {
      await Library.insertMany(libraries);
      console.log('Libraries inserted successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Generates a JWT token.
 * @param {Object} param
 * @param {string} param.id - User ID or unique identifier.
 * @param {string} [param.type='auth'] - Token type (e.g., 'auth', 'refresh').
 * @param {string} [param.expiresIn='30d'] - Token expiration time.
 * @returns {string} - JWT token.
 */
const getToken = ({ _id, role = ROLE.STUDENT, type = 'auth', expiresIn = '30d' }: Token): string =>
  jwt.sign({ _id, role, type }, ACCESS_KEY_TOKEN, { expiresIn });

/**
 * Sets a cookie in the response.
 * @param {Object} param
 * @param {Object} param.res - Express response object.
 * @param {Object} param.value - Value to store in the cookie.
 * @param {number} [param.expires=30] - Expiration time in days.
 */
const setCookie = ({
  res,
  value,
  expires = 30,
}: Cookie) => {
  const expiryDate: Date = new Date();

  expiryDate.setDate(expiryDate.getDate() + expires);
  // @ts-ignore
  res.cookie(TOKEN_NAME, JSON.stringify(value), {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiryDate,
  });
};

/**
 * Authentication utility for managing JWT cookies.
 * @param {Object} res - Express response object.
 * @param {Object} req - Express request object.
 * @returns {Object} - Object with `remove` and `get` methods for handling JWT cookies.
 */
const auth = (res: Response, req: Request) => ({
  /**
   * Removes the authentication cookie.
   */
  remove: (): void => {
    res.clearCookie(TOKEN_NAME);
  },

  /**
   * Retrieves the authentication token from cookies.
   * @returns {string|null} - Token string or null if not found.
   */
  get: (): string | null => {
    const token = req.cookies[TOKEN_NAME];

    return token ? token.replace(/"/g, '') : null;
  },
});

/**
 * Creates a response object with a bad request status.
 * @param {Object} res - Express response object.
 * @param {string} [message=''] - Message to include in the response.
 * @returns {Object} - Response object.
 */
const getResponse = (res: Response, message: string = ''): ResponseSend => ({
  data: null,
  res,
  message,
  statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
});

const getLocation = async (req: Request): Promise<Location> => {
  const ip: string | string[] | undefined = req.headers['x-forwarded-for'] || '';

  const { country, city, region } = await fetch(`https://ipinfo.io/${ip}?token=52df5d679dc04f`)
    .then(res => res.json());

  return {
    country,
    city,
    region
  };
};

/**
 * Executes an async function wrapped in a try-catch block, handles errors and sends a response.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Response} params.res - The HTTP response object to be used for sending responses.
 * @param {string} params.message - The message to include in the initial response.
 * @param {(response: ResponseSend) => Promise<any>} params.endpoint - An async function to be executed, receiving a response object.
 *
 * @returns {Promise<void>} Resolves after the endpoint function is executed or after an error is handled.
 */
const catchTry = async ({ res, message, endpoint }: TryCatch): Promise<void> => {
  const response: ResponseSend = getResponse(res, message);

  try {
    await endpoint(response);
  } catch (error) {
    response.message = `Error ${error}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
}

/**
 * Sends a JSON response.
 * @param {Object} param
 * @param {Object} param.res - Express response object.
 * @param {number} [param.statusCode=HTTP_STATUS_CODES.OK] - HTTP status code.
 * @param {Object|null} [param.data=null] - Data to include in the response.
 * @param {string} [param.message=''] - Message to include in the response.
 */
const send = ({
  res,
  statusCode = HTTP_STATUS_CODES.OK,
  data = null,
  message = '',
}: ResponseSend): express.Response<any, Record<string, any>> =>
  res.status(statusCode).json({ response: { statusCode, data, message } });


/**
 * Sends an email using Nodemailer.
 * @param {Object} param
 * @param {string} param.from - Sender's email address.
 * @param {string} param.to - Recipient's email address.
 * @param {string} param.subject - Subject of the email.
 * @param {string} param.html - HTML content of the email.
 * @returns {Promise<boolean>} - True if the email was sent successfully, otherwise false.
 */
const sendEmail = async ({ from, to, subject, html }: SendEmailProps): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    //@ts-ignore
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
  });

  try {
    await transporter.sendMail({ from, to, subject, html });
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * Formats a phone number string by removing any non-digit characters 
 * and applying the format "(XXX) XXX-XXXX".
 *
 * @param {string} [number=''] - The phone number string to format. Defaults to an empty string if no value is provided.
 * @returns {string} The formatted phone number in the form "(XXX) XXX-XXXX".
 *
 * @example
 * formatPhoneNumber('1234567890');
 * // Returns "(123) 456-7890"
 */
const formatPhoneNumber = (number: string = ''): string =>
  number
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

const getPayment = async (id: ObjectId | undefined | string) => {
  const payment = await StudentPayment.findOne({ idUser: id }).sort({ _id: -1 });
  const isPayment = payment ? new Date(payment.dateEnd) > new Date() : false;

  return {
    plan: payment ? payment.plan : '',
    isPayment
  }
}

/**
 * Uploads an image file to Vercel Blob Storage after resizing.
 * @param {Object} param
 * @param {string} param.filename - Name of the file to upload.
 * @param {Buffer} param.file - File buffer to upload.
 * @param {Object} [param.size] - Dimensions to resize the image.
 * @param {number} [param.size.height=196] - Height of the resized image.
 * @param {number} [param.size.width=192] - Width of the resized image.
 * @returns {Promise<string>} - URL of the uploaded image.
 */
const uploadBlodToVercel = async ({
  filename,
  file,
  size: { height, width } = { height: 196, width: 192 }
}: UploadBlodToVercelProps): Promise<string> => {
  const resizedImage = await sharp(file)
    .resize(width, height)
    .toBuffer();

  const { url } = await put(
    filename,
    resizedImage, {
    access: 'public',
  });

  return url;
}

const getLink = ({ req, path, token }: { req: RequestType; path: string; token: string; } ): string =>
  `${req.protocol}://${req.get('host')}/${path}/${token}`;

export {
  isDev,
  serveApp,
  connectToDatabase,
  send,
  initialDatabase,
  getToken,
  setCookie,
  auth,
  hash,
  getResponse,
  getLocation,
  catchTry,
  sendEmail,
  formatPhoneNumber,
  getPayment,
  uploadBlodToVercel,
  getLink
};
