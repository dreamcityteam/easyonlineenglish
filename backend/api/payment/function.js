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


const formatDate = () => {
  const date = new Date();
  const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} DE ${month} DEL ${year}`;
}

const getMessage = ({ name, phone, description, price, total }) => `
  <div style="box-sizing: border-box; padding: 20px; font-family: arial; width: 100%; overflow: hidden;">
    <header style="align-items: center; border-bottom: solid #598da6 2px; display: flex; justify-content: space-between; width: 100%;">
      <img src="https://easyonlineenglish-eight.vercel.app/images/logo.svg" alt="logo">
      <h2 style="color: #06609e; font-size: 60px;">FACTURA</h2>
    </header>
    <div style="display: flex; padding-bottom: 20px; justify-content: space-between; margin-top: 20px; width: 100%;">
      <div style="line-height: 1.5;">
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
      <div>
        <div>
          <span>${formatDate()}</span>
        </div>
      </div>
    </div>
    <table style="border-collapse: collapse; margin-top: 50px; width: 100%;">
      <thead>
        <tr>
          <th style="text-align: left; border-bottom: solid #598da6 2px; padding: 20px 0;">Descripción</th>
          <th style="text-align: center; border-bottom: solid #598da6 2px; padding: 20px 0;">Precio</th>
          <th style="text-align: right; border-bottom: solid #598da6 2px; padding: 20px 0;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: left; border-bottom: solid #598da6 2px; padding: 20px 0;">${description}</td>
          <td style="text-align: center; border-bottom: solid #598da6 2px; padding: 20px 0;">${price}</td>
          <td style="text-align: right; border-bottom: solid #598da6 2px; padding: 20px 0;">${total}</td>
        </tr>
      </tbody>
    </table>
  </div>
`;


const getDurationInMonth = (durationInMonth) => {
  const currentDate = new Date();

  currentDate.setMonth(currentDate.getMonth() + durationInMonth);

  return new Date(currentDate);
}

const formatPhoneNumber = (phoneNumber = '') =>
  phoneNumber
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

module.exports = {
  getData,
  getMessage,
  getDurationInMonth,
  formatPhoneNumber
}
