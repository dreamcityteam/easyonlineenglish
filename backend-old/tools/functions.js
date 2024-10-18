const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { HTTP_STATUS_CODES } = require('./const');
const sharp = require('sharp');
const { put } = require('@vercel/blob');

const {
  TOKEN_NAME,
  ACCESS_KEY_TOKEN,
  EMAIL_HOST,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_PORT
} = process.env;

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
}) => {
  res.status(statusCode).json({ response: { statusCode, data, message } });
};
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
}) => {
  const expiryDate = new Date();

  expiryDate.setDate(expiryDate.getDate() + expires);

  res.cookie(TOKEN_NAME, JSON.stringify(value), {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    expires: expiryDate,
  });
};
/**
 * Generates a JWT token.
 * @param {Object} param
 * @param {string} param.id - User ID or unique identifier.
 * @param {string} [param.type='auth'] - Token type (e.g., 'auth', 'refresh').
 * @param {string} [param.expiresIn='30d'] - Token expiration time.
 * @returns {string} - JWT token.
 */
const getToken = ({ id, type = 'auth', expiresIn = '30d' }) =>
  jwt.sign({ id, type }, ACCESS_KEY_TOKEN, { expiresIn });

/**
 * Hashing utility for creating and comparing hashed values.
 */
const hash = {
  /**
   * Creates a hash from a given value.
   * @param {string} value - Value to hash.
   * @returns {Promise<string>} - Hashed value.
   */
  create: async (value) => {
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
  compare: async ({ password, hash }) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error comparing hash:', error);
      return false;
    }
  },
};

/**
 * Creates a response object with a bad request status.
 * @param {Object} res - Express response object.
 * @param {string} [message=''] - Message to include in the response.
 * @returns {Object} - Response object.
 */
const getResponse = (res, message = '') => ({
  data: null,
  res,
  message,
  statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
});

/**
 * Sends an email using Nodemailer.
 * @param {Object} param
 * @param {string} param.from - Sender's email address.
 * @param {string} param.to - Recipient's email address.
 * @param {string} param.subject - Subject of the email.
 * @param {string} param.html - HTML content of the email.
 * @returns {Promise<boolean>} - True if the email was sent successfully, otherwise false.
 */
const sendEmail = async ({ from, to, subject, html }) => {
  const transporter = nodemailer.createTransport({
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
 * Authentication utility for managing JWT cookies.
 * @param {Object} res - Express response object.
 * @param {Object} req - Express request object.
 * @returns {Object} - Object with `remove` and `get` methods for handling JWT cookies.
 */
const auth = (res, req) => {
  const { TOKEN_NAME } = process.env;

  return {
    /**
     * Removes the authentication cookie.
     */
    remove: () => {
      res.clearCookie(TOKEN_NAME);
    },

    /**
     * Retrieves the authentication token from cookies.
     * @returns {string|null} - Token string or null if not found.
     */
    get: () => {
      const token = req.cookies[TOKEN_NAME];

      return token ? token.replace(/"/g, '') : null;
    },
  }
};

/**
 * Calculates a future date based on the number of months added to the current date.
 * @param {number} durationInMonth - Number of months to add.
 * @returns {Date} - Future date.
 */
const getDurationInMonth = (durationInMonth) => {
  const currentDate = new Date();

  currentDate.setMonth(currentDate.getMonth() + durationInMonth);

  return new Date(currentDate);
}

/**
 * Calculates the difference in months between two dates.
 * @param {string|Date} dateFrom - Start date.
 * @param {string|Date} dateTo - End date.
 * @returns {number} - Difference in months.
 */
const getMonthsDiff = (dateFrom, dateTo) => {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  const fromYear = from.getFullYear();
  const fromMonth = from.getMonth();
  const toYear = to.getFullYear();
  const toMonth = to.getMonth();

  let months = (toYear - fromYear) * 12 + (toMonth - fromMonth);

  if (to.getDate() < from.getDate()) {
    months--;
  }

  return months;
}

/**
 * Checks if the environment is in development mode.
 * @returns {boolean} - True if in development mode, otherwise false.
 */
const isDev = () =>
  process.env.NODE_ENV && process.env.NODE_ENV.includes('DEVELOPMENT');

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
}) => {
  const resizedImage = await sharp(file)
    .resize(width, height)
    .toBuffer();

  const { url } = await put(filename, resizedImage, {
    access: 'public',
  });

  return url;
}

module.exports = {
  send,
  setCookie,
  getToken,
  getResponse,
  hash,
  sendEmail,
  auth,
  getDurationInMonth,
  getMonthsDiff,
  isDev,
  uploadBlodToVercel
};
