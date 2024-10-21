const id: string = '12345';
const url: string = 'https://7529-2803-4dc0-900-7110-4549-9c3a-2d12-6d14.ngrok-free.app';

const getData = ({ number, expiration, csv, amount }: { number: string; expiration: string; csv: string; amount: string; }) => ({
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
  ForceNo3DS: '0',
  ThreeDSAuth: {
    TermUrl: `${url}?sid=${id}`,
    MethodNotificationUrl: `${url}?sid=${id}`,
    RequestorChallengeIndicator: "04",
  },
  CardHolderInfo: {
    Email: "",
    Name: "Nombre Cardholder",
    PhoneHome: "",
    PhoneMobile: "",
    PhoneWork: "",
  },
  BrowserInfo: {
    AcceptHeader:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    IPAddress: "127.0.0.1",
    Language: "en-US",
    ColorDepth: "24",
    ScreenWidth: "2880",
    ScreenHeight: "1800",
    TimeZone: "240",
    UserAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
    JavaScriptEnabled: "true",
  },
});

export {
  getData,
};
