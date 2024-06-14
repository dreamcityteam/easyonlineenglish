const User = require('../schemas/user.schema');
const StudentPayment = require('../schemas/studentPayment.schema');
const connectToDatabase = require('../db');
const { getDurationInMonth, sendEmail, getMonthsDiff } = require('./functions')
const { PAYMENT_METHOD } = require('./const');

const payment = async ({
  idUser,
  payment: {
    name,
    plan,
    azulRRN = null,
    azulCustomOrderId = null,
    azulOrderId = null,
    azulTicket = null,  
    type  
  }
}) => {
  let isPayment = false;
  const PAYMENT = PAYMENT_METHOD[plan];

  if (!PAYMENT) {
    return isPayment;
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: idUser }).select({ __v: 0 });

    if (user && PAYMENT) {
      const payment = await StudentPayment.findOne({ idUser }).sort({ _id: -1 });
      const lastPayment = payment ? getMonthsDiff(payment.dateStart, payment.dateEnd) : 0;

      const newPayment = new StudentPayment({
        idUser,
        name: type === 'PAYPAL' ? user.name : name,
        plan,
        dateEnd: getDurationInMonth(lastPayment + PAYMENT.DURATION_IN_MONTHS),
        azulRRN,
        azulCustomOrderId,
        azulOrderId,
        azulTicket,
        amount: PAYMENT.AMOUNT,
        type
      });

      await newPayment.save();

      const emailConfig = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'easyonlineenglish - FACTURA',
        html: getBillTemplate({
          name: `${user.name} ${user.lastname}`,
          phone: user.phone,
          description: PAYMENT.DESCRIPTION,
          price: PAYMENT.AMOUNT,
          total: PAYMENT.AMOUNT,
          dateStart: newPayment.dateStart,
          dateEnd: newPayment.dateEnd,
        }),
      };

      if (newPayment) {
        await sendEmail(emailConfig);

        isPayment = true;
      }
    }
  } catch(error) {
    console.error(error)
  }

  return isPayment;
}

const getBillTemplate = ({
  name,
  phone,
  description,
  price,
  total,
  dateStart,
  dateEnd
}) => {
  const LOGO_URL = 'https://easyonlineenglish.com/wp-content/uploads/2023/12/Logo-Demo-12.png';

  const formatRow = (textAlign) => 
    `style="text-align: ${textAlign}; border-bottom: solid #598da6 2px; padding: 20px 0;"`;

  const formatDate = (date) => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} de ${month} del ${year}`;
  }

  return `
  <div style="box-sizing: border-box; padding: 20px; font-family: arial; width: 100%; color: black; display: flex;">
    <div style="width: 800px;">
      <header style="align-items: center; border-bottom: solid #598da6 2px; display: flex; width: 100%;">
        <div style="width: 300px;">
          <img src="${LOGO_URL}" alt="logo" style="width: 80%;">
        </div>
        <div style="width: 700px; text-align: right;">
          <h2 style="color: #06609e; font-size: 40px;">FACTURA</h2>
        </div>
      </header>
      <div style="display: flex; padding-bottom: 20px; justify-content: space-between; margin-top: 20px; width: 100%; justify-content: space-between;">
        <div style="width: 100%;">
          <div>
            <strong>Datos del cliente</strong>
          </div>
          <div style="text-transform: capitalize; margin-top: 10px">
            <span><strong>Nombre: </strong> ${name}</span>
          </div>
          <div>
            <span><strong>Teléfono: </strong> ${phone}</span>
          </div>
        </div>
        <div style="line-height: 1.3; width: 270px;">
          <div>
            <span><strong>RNC: </strong>1-31-68522-6</span>
          </div>
          <div>
             <span><strong>Fecha: </strong>${formatDate(dateStart)}</span>
          </div>
        </div>
      </div>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th ${formatRow('left')}>Descripción</th>
            <th ${formatRow('center')}>Fecha de pago</th>
            <th ${formatRow('center')}>Fecha de vencimiento</th>
            <th ${formatRow('center')}>Precio</th>
            <th ${formatRow('right')}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td ${formatRow('left')}>${description}</td>
            <td ${formatRow('center')}>${formatDate(dateStart)}</td>
            <td ${formatRow('center')}>${formatDate(dateEnd)}</td>
            <td ${formatRow('center')}>${price}</td>
            <td ${formatRow('right')}>${total}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin: 20px 0; font-size: 12px;">
        <div style="margin-top: 5px;">EASY ONLINE ENGLISH, <strong>S.R.L</strong></div>
        <div style="margin-top: 5px;">+1 (849) 410-9664</div>    
        <div style="margin-top: 5px;">customerservice@easyonlineenglish.com</div>
      </div>
    </div>
  </div>
`;
};

module.exports = {
  payment
}
