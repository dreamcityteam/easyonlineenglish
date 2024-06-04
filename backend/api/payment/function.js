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
  <style>
   .invoice {
      box-sizing: border-box;
      padding: 20px;
      font-family: arial;
      width: 100%;
      overflow: hidden;
    }

    .invoice__header {
      align-items: center;
      border-bottom: solid #598da6 2px;
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .invoice__titulo {
      color: #06609e;
      font-size: 60px;
    }

    .invoice__user {
      display: flex;
      padding-bottom: 20px;
      justify-content: space-between;
      margin-top: 20px;
      width: 100%;
    }

    .invoice__user > div {
      line-height: 1.5;
    }

    .invoice__name {
      text-transform: capitalize;
    }

    .invoice__table {
      border-collapse: collapse;
      margin-top: 50px;
      width: 100%;
    }

    .invoice__table th,
    .invoice__table td {
      text-align: center;
      border-bottom: solid #598da6 2px;
      padding: 20px 0;
    }

    .invoice__table th:last-child,
    .invoice__table td:last-child {
      text-align: right;
    }

    .invoice__table th:first-child,
    .invoice__table td:first-child {
      text-align: left;
    }
  </style>
  <div class="invoice">
    <header class="invoice__header">
      <img src="https://easyonlineenglish-eight.vercel.app/images/logo.svg" alt="logo">
      <h2 class="invoice__titulo">FACTURA</h2>
    </header>
    <div class="invoice__user">
      <div>
        <div>
          <strong>Datos del cliente</strong>
        </div>
        <div class="invoice__name">
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
     <table class="invoice__table">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Total</th>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>${description}</td>
          <td>${price}</td>
          <td>${total}</td>
        </tr>
      </thead>
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
