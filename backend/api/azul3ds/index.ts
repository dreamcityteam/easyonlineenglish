import { Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { catchTry, connectToDatabase, payment } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE, PAYMENT_METHOD } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import { getData } from './functions';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Error sending email',
    endpoint: async (response) => {
      await connectToDatabase();

      const certificateFile = fs.readFileSync(
        path.resolve(__dirname, 'certificate', 'pfx_easyonlineenglish.local.pfx')
      );
      const { csv, expiration, number, plan = 1, name } = req.body;
      const { _id } = req.user;
      // @ts-ignore
      const PAYMENT = PAYMENT_METHOD[plan];
      const API: string = 'https://pruebas.azul.com.do/WebServices/JSON/default.aspx';

      const { data } = await axios.post(
        API,
        getData({
          number,
          expiration,
          csv,
          amount: PAYMENT.AMOUNT
        }),
        {
          httpsAgent: new https.Agent({
            //@ts-ignore
            hostname: 'pruebas.azul.com.do',
            port: 443,
            path: '/WebServices/JSON/default.aspx',
            method: 'POST',
            pfx: certificateFile,
            passphrase: '123',
          }),
          headers: {
            'Content-Type': 'application/json',
            'Auth1': '3dsecure',
            'Auth2': '3dsecure'
          }
        });

      if (data.IsoCode === '00') {
        const isPayment = await payment({
          idUser: _id,
          payment: {
            name,
            plan,
            azulRRN: data.RRN,
            azulCustomOrderId: data.CustomOrderId,
            azulOrderId: data.AzulOrderId,
            azulTicket: data.Ticket,
            amount: PAYMENT.AMOUNT,
            type: 'AZUL'
          }
        });
  
        if (isPayment) {
          response.data.message = MESSAGE.SUCCESSFUL;
          response.statusCode = HTTP_STATUS_CODES.OK;
        }
  
      } else if (data.IsoCode === '99') {
        response.data.message = 'Número de tarjeta inválido.';
      } else if (data.IsoCode === '63') {
        response.data.message = 'Lo sentimos, su tarjeta ha sido declinada.';
      } else if (['Expiration', 'ExpirationPassed'].includes(data.ErrorDescription.replace('VALIDATION_ERROR:', ''))) {
        response.data.message = 'Fecha de expiración inválida.';
        response.data.field = 'expiry';
      } else if (data.ErrorDescription === 'VALIDATION_ERROR:CVC') {
        response.data.message = 'El cvc es incorrecto.';
        response.data.field = 'cvc';
      } else {
        response.message = data.ErrorDescription;
      }
    }
  });
};

export default endpoint;
