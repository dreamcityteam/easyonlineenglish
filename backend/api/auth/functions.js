const StudentPayment = require('../../schemas/studentPayment.schema');

const getIsPayment = async (id) => {
  const payment = await StudentPayment.findOne({ idUser: id }).sort({ _id: -1 });
  const isPayment = payment ? new Date(payment.dateEnd) > new Date() : false;

  return isPayment;
}

module.exports = {
  getIsPayment
};
