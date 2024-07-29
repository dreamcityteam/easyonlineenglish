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

const send = ({
  res,
  statusCode = HTTP_STATUS_CODES.OK,
  data = null,
  message = '',
}) => {
  res.status(statusCode).json({ response: { statusCode, data, message } });
};

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

const getToken = ({ id, type = 'auth', expiresIn = '30d' }) =>
  jwt.sign({ id, type }, ACCESS_KEY_TOKEN, { expiresIn });

const hash = {
  create: async (value) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  },

  compare: async ({ password, hash }) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error comparing hash:', error);
      return false;
    }
  },
};

const getResponse = (res, message = '') => ({
  data: null,
  res,
  message,
  statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
});

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

const auth = (res, req) => {
  const { TOKEN_NAME } = process.env;

  return {
    remove: () => {
      res.clearCookie(TOKEN_NAME);
    },

    get: () => {
      const token = req.cookies[TOKEN_NAME];

      return token ? token.replace(/"/g, '') : null;
    },
  }
};

const getDurationInMonth = (durationInMonth) => {
  const currentDate = new Date();

  currentDate.setMonth(currentDate.getMonth() + durationInMonth);

  return new Date(currentDate);
}

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

const isDev = () =>
  process.env.NODE_ENV && process.env.NODE_ENV.includes('DEVELOPMENT');

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
