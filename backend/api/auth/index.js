const { getResponse, getToken, send, setCookie, hash } = require('../../tools/functions');
const User = require('../../schemas/user.schema');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const StudentPayment = require('../../schemas/studentPayment.schema');

const getIsPayment = async () => {
  const payment = await StudentPayment.findOne().sort({ _id: -1 });
  const isPayment = payment ? new Date(payment.dateEnd) > new Date() : false;

  return isPayment;
}

const auth = async (req, res) => {
  const { username = '', password = '' } = req.body;
  const response = getResponse(res);

  try {
    if (req.user) {
      const user = await User.findById(req.user.id, { password: 0, __v: 0 });

      if (!user) {
        response.message = 'User not found';
      } else {
        response.data = user.toObject();
        response.data.isPayment = await getIsPayment();
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = 'Success!';
      }

      return send(response);
    }

    const field = username.toLowerCase();
    const user = await User.findOne({ $or: [{ email: field }, { username: field }] }).select({ __v: 0});

    if (!user) {
      response.message = 'User not found';
    } else if (await hash.compare({ password, hash: user.password })) {
      setCookie({ res, value: getToken({ id: user._id }) });
      const { password, ...userData } = user.toObject();

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Success!';
      response.data = userData;
      response.data.isPayment = await getIsPayment();
    }
  } catch (error) {
    response.message = `Error saving user! ${error}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};

module.exports = auth;
