const StudentPayment = require('../../schemas/studentPayment.schema');

const getPayment = async (id) => {
  const payment = await StudentPayment.findOne({ idUser: id }).sort({ _id: -1 });
  const isPayment = payment ? new Date(payment.dateEnd) > new Date() : false;

  return {
    plan: payment ? payment.plan : '',
    isPayment
  }
}

module.exports = {
  getPayment
};
