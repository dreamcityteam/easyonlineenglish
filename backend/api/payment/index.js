const fs = require('fs');
const https = require('https');
const axios = require('axios');
const { getResponse, send } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const path = require('path');

async function fetchAzulData(req, res) {
  const response = getResponse(res);
  const {amount = "40", csv="732", expiration="202412", number="5424180279791732"} = req.body;

  const pfxFilePath = path.resolve(__dirname, 'cert', 'pfx_easyonlineenglish.local.pfx');
  const pfxFile = fs.readFileSync(pfxFilePath);
  const options = {
    hostname: 'pruebas.azul.com.do',
    port: 443,
    path: '/WebServices/JSON/default.aspx',
    method: 'POST',
    pfx: pfxFile,
    passphrase: '123',
  };


  const data = {
    "Channel": "EC",
    "Store": "39038540035",
    "CardNumber": number,
    "Expiration": expiration,
    "CVC": csv,
    "PosInputMode": "E-Commerce",
    "TrxType": "Sale",
    "Amount": amount,
    "Itbis": "000",
    "CurrencyPosCode": "$",
    "Payments": "1",
    "Plan": "0",
    "OriginalDate": "",
    "OriginalTrxTicketNr": "",
    "AuthorizationCode": "",
    "ResponseCode": "",
    "AcquirerRefData": "1",
    "RRN": null,
    "AzulOrderId": null,
    "CustomerServicePhone": "",
    "OrderNumber": "456432165",
    "ECommerceUrl": "www.easyonlineenglish.com",
    "CustomOrderId": "trx123",
    "DataVaultToken": "",
    "SaveToDataVault": "0",
    "AltMerchantName": "",
    "ForceNo3DS": "1"
  };

  try {

    const result = await axios.post('https://pruebas.azul.com.do/WebServices/JSON/default.aspx', data, {
      httpsAgent: new https.Agent(options),
      headers: {
        'Content-Type': 'application/json',
        'Auth1': 'splitit',
        'Auth2': 'splitit'
      }
    });

    console.log(result.data);
    response.data = result
    response.message = ""
    response.statusCode = HTTP_STATUS_CODES.OK
  } catch (error) {
    response.message = error.message
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
  }

   send(response);
}

module.exports =fetchAzulData;