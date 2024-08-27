const axios = require("axios");
//import { Payment3dSecureAPIDto } from "src/booking/dto/payment-3d-secure.dto";
//import { formatExpirationDate } from "src/utils/paymentManager.utils";

//import { CreditCardPaymentDTO, getCardBrand, maskString } from "src/utils/payments.dto";
const lodash = require("lodash");

const fs = require("fs");
const https = require("https");
const AzulTransactionResp = require("../../schemas/azulPaymentResp.schema");
const connectToDatabase = require("../../db");

module.exports = class Payment3dSecureService {
	options = {
		key: "",
		cert: "",
	};

	Cred = {
		Auth1: process.env.AZUL_PAYMENT_AUTH1,
		Auth2: process.env.AZUL_PAYMENT_AUTH2,
		MainUrl: process.env.MAIN_URL,
		AltUrl: process.env.MAIN_URL,
		MerchantId: process.env.AZUL_PAYMENT_STORE,
		Channel: process.env.AZUL_PAYMENT_CHANNEL,
		TimeOut: "20000",
		LogsPath: "./",
	};

	constructor() {
		if (!this.options) {
			const options = this._getOptions("", true);

			this.options = {
				//key: options.key,
				//cert: options.cert,
				pfx: options.pfx,
			};
		}
	}

	_getOptions(path, env) {
		var certFile = "";
		var keyFile = "";
		var pfxFile = "";

		const fullPath = process.cwd();

		if (process.env.NODE_ENV == "production") {
			const routePath = `${fullPath}/api/azul3ds/certificate/`;
			fs.readdirSync(routePath).forEach(function (file) {
				var route = routePath + file;
				var fileContent = fs.readFileSync(route);
				if (file === "pfx_easyonlineenglish.local.pfx") {
					pfxFile = fileContent;
				} else if (file === "Codika_cert.pem") {
					certFile = fileContent;
				} else if (file === "Key.pem") {
					keyFile = fileContent;
				}
			});
		} else {
			const routePath = `${fullPath}/api/azul3ds/certificate/`;
			fs.readdirSync(routePath).forEach(function (file) {
				var route = routePath + file;
				var fileContent = fs.readFileSync(route);
				if (file === "pfx_easyonlineenglish.local.pfx") {
					pfxFile = fileContent;
				} else if (file === "Codika_cert.pem") {
					certFile = fileContent;
				} else if (file === "Key.pem") {
					keyFile = fileContent;
				}
			});
		}

		let options = {
			//hostname: env ? this.Cred.MainUrl + '.azul.com.do' : this.Cred.AltUrl + '.azul.com.do',
			hostname: "pruebas.azul.com.do",
			port: 443,
			path: path,
			method: "POST",
			timeout: parseInt(this.Cred.TimeOut),
			headers: { "Content-Type": "application/json", Auth1: this.Cred.Auth1, Auth2: this.Cred.Auth2 },
			json: true,
			key: keyFile,
			cert: certFile,
			pfx: pfxFile,
		};

		return options;
	}

	async _logManager(resp, method, url, OrderNumber, CustomOrderId, error) {
		const date = new Date();

		if (resp.ResponseCode != "Error" && !error) {
			fs.appendFile(
				`${this.Cred.LogsPath}\\${method}${date.getDate()}${
					date.getUTCMonth() < 11 ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1
				}${date.getFullYear()}.txt`,
				`${url} | ${new Date()} | ${method} | ${OrderNumber ? OrderNumber : ""} | ${
					CustomOrderId ? CustomOrderId : ""
				} | ${JSON.stringify(resp)}\n`,
				(error) => {
					console.log("Error: " + error);
				},
			);
		} else if (!error) {
			fs.appendFile(
				`${this.Cred.LogsPath}\\${method}Validation${date.getDate()}${
					date.getUTCMonth() < 11 ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1
				}${date.getFullYear()}.txt`,
				`${url} | ${new Date()} | ${method} | ${OrderNumber ? OrderNumber : ""} | ${
					CustomOrderId ? CustomOrderId : ""
				} | ${JSON.stringify(resp)}\n`,
				(error) => {
					console.log("Error: " + error);
				},
			);
		}
		if (error) {
			fs.appendFile(
				`${this.Cred.LogsPath}\\${method}Error${date.getDate()}${
					date.getUTCMonth() < 11 ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1
				}${date.getFullYear()}.txt`,
				`${url} | ${new Date()} | ${method} | ${OrderNumber ? OrderNumber : ""} | ${
					CustomOrderId ? CustomOrderId : ""
				} | ${error} \n`,
				(error) => {
					console.log("Error: " + error);
				},
			);
		}
	}

	async _sendTrx(jsonData, method, path) {
		try {

			const options = this._getOptions(path, true);
			const response = await axios({
				url: `https://${options.hostname}${options.path}`,
				method: options.method,
				headers: options.headers,
				timeout: options.timeout,
				/*httpsAgent: new https.Agent({
                    key: options.key,
                    cert: options.cert
                }),*/
				/*httpsAgent: new https.Agent({
                    hostname: 'pruebas.azul.com.do',
                    port: 443,
                    path: '/WebServices/JSON/default.aspx',
                    method: 'POST',
                    pfx: options.pfx,
                    passphrase: '123',
                }),*/
				httpsAgent: new https.Agent({
					key: options.key,
					cert: options.cert,
				}),
				data: jsonData,
			});

			this._logManager(response.data, method, "MainUrl", jsonData.OrderNumber, jsonData.CustomOrderId, false);
			return response.data;
		} catch (error) {
			this._logManager(error.message, method, "MainUrl", jsonData.OrderNumber, jsonData.CustomOrderId, true);

			// If the main URL fails, retry using the alternate URL
			try {
				const optionsAlt = this._getOptions(path, false);
				const response = await axios({
					url: `https://${optionsAlt.hostname}${optionsAlt.path}`,
					method: optionsAlt.method,
					headers: optionsAlt.headers,
					timeout: optionsAlt.timeout,
					/*httpsAgent: new https.Agent({
                        hostname: 'pruebas.azul.com.do',
                        port: 443,
                        path: '/WebServices/JSON/default.aspx',
                        method: 'POST',
                        pfx: optionsAlt.pfx,
                        passphrase: '123',
                    }),*/
					httpsAgent: new https.Agent({
						key: optionsAlt.key,
						cert: optionsAlt.cert,
					}),
					data: jsonData,
				});

				this._logManager(
					response.data,
					method,
					"AlterUrl",
					jsonData.OrderNumber,
					jsonData.CustomOrderId,
					false,
				);
				return response.data;
			} catch (altError) {
				this._logManager(
					altError.message,
					method,
					"AlterUrl",
					jsonData.OrderNumber,
					jsonData.CustomOrderId,
					true,
				);
				throw altError;
			}
		}
	}

	async FindTransactionByOrderId(orderId) {
		return await this._azulTransactionRespModel.findOne({
			orderId,
		});
	}

	async FindTransactionByAzulOrderId(AzulOrderId) {
		return await this._azulTransactionRespModel.findOne({
			AzulOrderId,
		});
	}

	//Venta
	async Sale({
		CardNumber = "",
		Expiration = "",
		CVC = "",
		PosInputMode = "E-Commerce",
		Amount = "",
		Itbis = "",
		AcquirerRefData = "",
		CurrencyPosCode = "",
		OrderNumber = "",
		CustomOrderId = "",
		RRN = "",
		CustomerServicePhone = "",
		ECommerceUrl = "",
		DataVaultToken = "",
		SaveToDataVault = "",
		AltMerchantName = "",
		ForceNo3DS = "",
		ThreeDSAuth: { TermUrl, MethodNotificationUrl, RequestorChallengeIndicator },
		CardHolderInfo: {
			BillingAddressCity,
			BillingAddressCountry,
			BillingAddressLine1,
			BillingAddressLine2,
			BillingAddressLine3,
			BillingAddressState,
			BillingAddressZip,
			Email,
			Name,
			PhoneHome,
			PhoneMobile,
			PhoneWork,
			ShippingAddressCity,
			ShippingAddressCountry,
			ShippingAddressLine1,
			ShippingAddressLine2,
			ShippingAddressLine3,
			ShippingAddressState,
			ShippingAddressZip,
		},
	}) {
		const TrxType = "Sale";

		return await this._sendTrx(
			{
				Channel: this.Cred.Channel,
				Store: this.Cred.MerchantId,
				CardNumber,
				Expiration,
				CVC,
				PosInputMode,
				TrxType,
				Amount,
				Itbis,
				AcquirerRefData,
				CurrencyPosCode,
				OrderNumber,
				CustomOrderId,
				RRN,
				CustomerServicePhone,
				ECommerceUrl,
				DataVaultToken,
				SaveToDataVault,
				AltMerchantName,
				ForceNo3DS,
				ThreeDSAuth: { TermUrl, MethodNotificationUrl, RequestorChallengeIndicator },
				CardHolderInfo: {
					BillingAddressCity,
					BillingAddressCountry,
					BillingAddressLine1,
					BillingAddressLine2,
					BillingAddressLine3,
					BillingAddressState,
					BillingAddressZip,
					Email,
					Name,
					PhoneHome,
					PhoneMobile,
					PhoneWork,
					ShippingAddressCity,
					ShippingAddressCountry,
					ShippingAddressLine1,
					ShippingAddressLine2,
					ShippingAddressLine3,
					ShippingAddressState,
					ShippingAddressZip,
				},
			},
			TrxType,
			"/webservices/JSON/Default.aspx",
		);
	}

	//Hold
	async Hold({
		CardNumber = "",
		Expiration = "",
		CVC = "",
		PosInputMode = "",
		Amount = "",
		Itbis = "",
		AcquirerRefData = "",
		CurrencyPosCode = "",
		OrderNumber = "",
		CustomOrderId = "",
		RRN = "",
		CustomerServicePhone = "",
		ECommerceUrl = "",
		DataVaultToken = "",
		SaveToDataVault = "",
		AltMerchantName = "",
		ForceNo3DS = "",
		ThreeDSAuth: { TermUrl, MethodNotificationUrl, RequestorChallengeIndicator },
		CardHolderInfo: {
			BillingAddressCity,
			BillingAddressCountry,
			BillingAddressLine1,
			BillingAddressLine2,
			BillingAddressLine3,
			BillingAddressState,
			BillingAddressZip,
			Email,
			Name,
			PhoneHome,
			PhoneMobile,
			PhoneWork,
			ShippingAddressCity,
			ShippingAddressCountry,
			ShippingAddressLine1,
			ShippingAddressLine2,
			ShippingAddressLine3,
			ShippingAddressState,
			ShippingAddressZip,
		},
	}) {
		const TrxType = "Hold";

		return await this._sendTrx(
			{
				Channel: this.Cred.Channel,
				Store: this.Cred.MerchantId,
				CardNumber,
				Expiration,
				CVC,
				PosInputMode,
				TrxType,
				Amount,
				Itbis,
				AcquirerRefData,
				CurrencyPosCode,
				OrderNumber,
				CustomOrderId,
				RRN,
				CustomerServicePhone,
				ECommerceUrl,
				DataVaultToken,
				SaveToDataVault,
				AltMerchantName,
				ForceNo3DS,
				ThreeDSAuth: { TermUrl, MethodNotificationUrl, RequestorChallengeIndicator },
				CardHolderInfo: {
					BillingAddressCity,
					BillingAddressCountry,
					BillingAddressLine1,
					BillingAddressLine2,
					BillingAddressLine3,
					BillingAddressState,
					BillingAddressZip,
					Email,
					Name,
					PhoneHome,
					PhoneMobile,
					PhoneWork,
					ShippingAddressCity,
					ShippingAddressCountry,
					ShippingAddressLine1,
					ShippingAddressLine2,
					ShippingAddressLine3,
					ShippingAddressState,
					ShippingAddressZip,
				},
			},
			TrxType,
			"/webservices/JSON/Default.aspx",
		);
	}

	//Post
	async Post({ AzulOrderId = "", Amount = "", Itbis = "" }) {
		const TrxType = "Post";

		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, AzulOrderId, Amount, Itbis },
			TrxType,
			"/webservices/JSON/Default.aspx?ProcessPost",
		);
	}

	//VOID
	async Void({ AzulOrderId = "" }) {
		const TrxType = "Void";

		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, AzulOrderId },
			TrxType,
			"/webservices/JSON/Default.aspx?ProcessVoid",
		);
	}

	//Refund
	async Refund({
		Amount = "",
		CurrencyPosCode = "",
		OriginalDate = "",
		AzulOrderId = "",
		PosInputMode = "",
		AcquirerRefData = "",
		CardNumber = "",
		Expiration = "",
		CVC = "",
		OrderNumber = "",
		CustomOrderId = "",
		RRN = "",
		CustomerServicePhone = "",
		ECommerceUrl = "",
		DataVaultToken = "",
		SaveToDataVault = "",
		AltMerchantName = "",
		ForceNo3DS = "",
	}) {
		const TrxType = "Refund";

		return await this._sendTrx(
			{
				Channel: this.Cred.Channel,
				Store: this.Cred.MerchantId,
				CardNumber,
				Expiration,
				CVC,
				PosInputMode,
				TrxType,
				AzulOrderId,
				AcquirerRefData,
				OriginalDate,
				Amount,
				CurrencyPosCode,
				OrderNumber,
				CustomOrderId,
				RRN,
				CustomerServicePhone,
				ECommerceUrl,
				DataVaultToken,
				SaveToDataVault,
				AltMerchantName,
				ForceNo3DS,
			},
			TrxType,
			"/webservices/JSON/Default.aspx",
		);
	}

	//SaleCreateToken
	async SaleCreateToken({
		CardNumber = "",
		Expiration = "",
		CVC = "",
		PosInputMode = "",
		Amount = "",
		Itbis = "",
		AcquirerRefData = "",
		CurrencyPosCode = "",
		OrderNumber = "",
		CustomOrderId = "",
		DataVaultToken = "",
		CustomerServicePhone = "",
		ECommerceUrl = "",
		ForceNo3DS = "",
	}) {
		const TrxType = "Sale";
		const SaveToDataVault = "1";

		return await this._sendTrx(
			{
				Channel: this.Cred.Channel,
				Store: this.Cred.MerchantId,
				CardNumber,
				Expiration,
				CVC,
				PosInputMode,
				TrxType,
				Amount,
				Itbis,
				AcquirerRefData,
				CurrencyPosCode,
				OrderNumber,
				CustomOrderId,
				DataVaultToken,
				SaveToDataVault,
				CustomerServicePhone,
				ECommerceUrl,
				ForceNo3DS,
			},
			"SaleCreateToken",
			"/webservices/JSON/Default.aspx",
		);
	}

	//SaleToken
	async SaleToken({
		PosInputMode = "",
		Amount = "",
		Itbis = "",
		CurrencyPosCode = "",
		OrderNumber = "",
		AcquirerRefData = "",
		CardNumber = "",
		Expiration = "",
		CVC = "",
		CustomOrderId = "",
		DataVaultToken = "",
		CustomerServicePhone = "",
		ECommerceUrl = "",
		ForceNo3DS = "",
	}) {
		const TrxType = "Sale";
		const SaveToDataVault = "0";

		return await this._sendTrx(
			{
				Channel: this.Cred.Channel,
				Store: this.Cred.MerchantId,
				CardNumber,
				Expiration,
				CVC,
				PosInputMode,
				TrxType,
				Amount,
				Itbis,
				AcquirerRefData,
				CurrencyPosCode,
				OrderNumber,
				CustomOrderId,
				DataVaultToken,
				SaveToDataVault,
				CustomerServicePhone,
				ECommerceUrl,
				ForceNo3DS,
			},
			"SaleToken",
			"/webservices/JSON/Default.aspx",
		);
	}

	//DataVaultCreate
	async DataVaultCreate({ CardNumber = "", Expiration = "", CVC = "" }) {
		const TrxType = "CREATE";

		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, CardNumber, Expiration, CVC, TrxType },
			"DataVaultCreate",
			"/webservices/JSON/Default.aspx?ProcessDataVault",
		);
	}

	//DataVaultDelete
	async DataVaultDelete({ DataVaultToken = "" }) {
		const TrxType = "DELETE";

		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, DataVaultToken, TrxType },
			"DataVaultDelete",
			"/webservices/JSON/Default.aspx?ProcessDataVault",
		);
	}

	//ThreeDSecure
	async ThreeDSecure({ AzulOrderId = "", PaRes = "", MD = "" }) {
		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, AzulOrderId, PaRes, MD },
			"ThreeDSecure",
			"/webservices/JSON/Default.aspx?ProcessThreeDSChallenge",
		);
	}

	//VerifyPayment
	async VerifyPayment({ CustomOrderId = "" }) {
		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, CustomOrderId },
			"VerifyPayment",
			"/webservices/JSON/Default.aspx?VerifyPayment",
		);
	}

	//3D Secure V2
	async ThreeDSecure2({ AzulOrderId = "", MethodNotificationStatus = "" }) {
		const body = { Channel: this.Cred.Channel, Store: this.Cred.MerchantId, AzulOrderId, MethodNotificationStatus };

        return await this._sendTrx(body, "ProcessThreeDSMethod", "/webservices/JSON/Default.aspx?ProcessThreeDSMethod");
	}

	//3D Secure friction
	async ThreeDSecure2F({ AzulOrderId = "", CRes = "" }) {
		return await this._sendTrx(
			{ Channel: this.Cred.Channel, Store: this.Cred.MerchantId, AzulOrderId, CRes },
			"ProcessThreeDSChallenge2",
			"/webservices/JSON/Default.aspx?ProcessThreeDSChallenge",
		);
	}

	async MakePaymentOnSale(dto, _price, _itbis, hasSpecialServiceList = false) {
		const orderId = Date.now().toString(36).toUpperCase(); //Generate GUID for unique order

		let price = lodash.round(_price * 100).toString();
		let itbis = lodash.round(_itbis * 100).toString();

		if (!process.env.PRODUCTION) {
			price = "100";
			itbis = "18";
		}

		const resp = await this.Sale({
			CardNumber: dto.paymentInformation.cardNumber,
			Expiration: dto.paymentInformation.expirationDate,
			CVC: dto.paymentInformation.cvv,
			PosInputMode: "E-Commerce",
			Amount: price,
			Itbis: itbis,
			CurrencyPosCode: "$",
			AcquirerRefData: "1",
			OrderNumber: orderId,
			CustomOrderId: orderId,
			//ForceNo3DS: "", //Check,
			ThreeDSAuth: {
				TermUrl: `${process.env.BACKEND_SERVER_URL}/azul-payment-3ds-notification?orderId=${orderId}`,
				MethodNotificationUrl: `${process.env.BACKEND_SERVER_URL}/azul-payment-3ds-notification?orderId=${orderId}`,
				RequestorChallengeIndicator: "01",
			},
			CardHolderInfo: {
				Email: dto.paymentInformation?.email ?? "",
				Name: dto.paymentInformation.cardholderName,
				BillingAddressCity: dto.paymentInformation.billingAddress?.city,
				BillingAddressCountry: dto.paymentInformation.billingAddress?.country,
				BillingAddressLine1: dto.paymentInformation.billingAddress?.addressLine1,
				BillingAddressLine2: dto.paymentInformation.billingAddress?.addressLine2,
				BillingAddressState: dto.paymentInformation.billingAddress?.zone,
				BillingAddressZip: dto.paymentInformation.billingAddress.zipCode,
				BillingAddressLine3: "",
				PhoneHome: dto.paymentInformation?.phone ?? "",
				PhoneMobile: "",
				PhoneWork: "",
				ShippingAddressCity: "",
				ShippingAddressCountry: "",
				ShippingAddressLine1: "",
				ShippingAddressLine2: "",
				ShippingAddressLine3: "",
				ShippingAddressState: "",
				ShippingAddressZip: "",
			},
		});

		//dto.paymentInformation.cardType = getCardBrand(dto.paymentInformation.cardNumber)
		//dto.paymentInformation.cardNumber = maskString(dto.paymentInformation.cardNumber)

		await connectToDatabase();

		await AzulTransactionResp.create({
			transactionResp: [resp],
			recordLocator: dto.recordLocator,
			recordLocatorVersion: dto.recordLocatorVersion,
			AzulOrderId: resp.AzulOrderId,
			orderId,
			hasSpecialServiceList,
			paymentInformation: dto.paymentInformation,
			notificationEmails: dto.notificationEmails,
			amount: _price,
			itbis: _itbis,
		});

		return { data: resp, orderId, respMsg: resp.ResponseMessage };
	}

	async ConfirmPayment(orderId, AzulOrderId, _price, _itbis) {
		let price = lodash.round(_price * 100).toString();
		let itbis = lodash.round(_itbis * 100).toString();

		if (!process.env.PRODUCTION) {
			price = "100";
			itbis = "18";
		}

		const resp = await this.Post({
			AzulOrderId,
			Amount: price,
			Itbis: itbis,
		});

		return { data: resp, orderId, respMsg: resp.ResponseMessage };
	}

	async CancelPayment(AzulOrderId, price, createdAt) {
		let Amount = lodash.round(price * 100).toString();
		//const OriginalDate = formatDateToYYYYMMDD(createdAt)
		const resp = await this.Refund({
			AzulOrderId,
			Amount,
			CurrencyPosCode: "$",
			//OriginalDate,
			PosInputMode: "E-Commerce",
		});

		return { data: resp, respMsg: resp.ResponseMessage };
	}

	async approvedTransaction(orderId, response) {
		await connectToDatabase();

		const transaction = await AzulTransactionResp.findOne({
			orderId: orderId,
		});

		if (!transaction) {
			transaction.statusMSG = "Transacción no encontrada";
			await transaction.save();
			response.data.message = "Transacción no encontrada";
			response.data.success = false;
		}

		if (transaction.approved) {
			transaction.statusMSG = "Transacción ya aprobada";
			await transaction.save();
			response.data.message = "Transacción ya aprobada";
			response.data.success = false;
		}

		const approval_resp = transaction.transactionResp.find(
			(_transactionResp) => _transactionResp.IsoCode == "00" || _transactionResp.ResponseMessage == "APROBADA",
		);

		if (!approval_resp) {
			if (transaction.transactionResp.length > 0) {
				transaction.statusMSG =
					transaction.transactionResp[transaction.transactionResp.length - 1]?.ErrorDescription ??
					"Transacción declinada";
				response.data.message =
					transaction.transactionResp[transaction.transactionResp.length - 1]?.ErrorDescription ??
					"Transacción declinada";
				response.data.success = false;
				await transaction.save();
			}
		} else {
			transaction.approved = true;
			response.data.success = true;
			response.data.message = "Transacción aprobada";
			await transaction.save();
		}
	}
};
