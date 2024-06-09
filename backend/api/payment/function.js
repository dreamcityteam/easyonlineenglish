const getData = ({ number, expiration, csv, amount }) => ({
  Channel: 'EC',
  Store: '39038540035',
  CardNumber: number,
  Expiration: expiration,
  CVC: csv,
  PosInputMode: 'E-Commerce',
  TrxType: 'Sale',
  Amount: amount,
  Itbis: '000',
  CurrencyPosCode: '$',
  Payments: '1',
  Plan: '0',
  OriginalDate: '',
  OriginalTrxTicketNr: '',
  AuthorizationCode: '',
  ResponseCode: '',
  AcquirerRefData: '1',
  RRN: null,
  AzulOrderId: null,
  CustomerServicePhone: '',
  OrderNumber: '456432165',
  ECommerceUrl: 'www.easyonlineenglish.com',
  CustomOrderId: 'trx123',
  DataVaultToken: '',
  SaveToDataVault: '0',
  AltMerchantName: '',
  ForceNo3DS: '1'
});


const formatDate = (date) => {
  const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} DE ${month} DEL ${year}`;
}

const getHtmlMessage = ({
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

  return `
  <div style="box-sizing: border-box; padding: 20px; font-family: arial; width: 100%; color: black; display: flex;">
    <div style="width: 800px;">
      <header style="align-items: center; border-bottom: solid #598da6 2px; display: flex; width: 100%;">
        <div style="width: 300px;">
          <img src="${LOGO_URL}" alt="logo" style="width: 100%;">
        </div>
        <div style="width: 700px; text-align: right;">
          <h2 style="color: #06609e; font-size: 60px;">FACTURA</h2>
        </div>
      </header>
      <div style="display: flex; padding-bottom: 20px; justify-content: space-between; margin-top: 20px; width: 100%; justify-content: space-between;">
        <div style="width: 100%; line-height:1.5;">
          <div>
            <strong>Datos del cliente</strong>
          </div>
          <div style="text-transform: capitalize;">
            <span>${name}</span>
          </div>
          <div>
            <span>${phone}</span>
          </div>
        </div>
        <div style="width: 100%; text-align: right;">
          <div>
            <span>${formatDate(dateStart)}</span>
          </div>
        </div>
      </div>
      <table style="border-collapse: collapse; margin-top: 50px; width: 100%;">
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
            <td ${formatRow('center')}>${dateStart}</td>
            <td ${formatRow('center')}>${dateEnd}</td>
            <td ${formatRow('center')}>${price}</td>
            <td ${formatRow('right')}>${total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
`;
};

const getDurationInMonth = (durationInMonth) => {
  const currentDate = new Date();

  currentDate.setMonth(currentDate.getMonth() + durationInMonth);

  return new Date(currentDate);
}

const formatPhoneNumber = (phoneNumber = '') =>
  phoneNumber
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

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

module.exports = {
  getData,
  getHtmlMessage,
  getDurationInMonth,
  formatPhoneNumber,
  getMonthsDiff
}
