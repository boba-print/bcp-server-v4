import axios, { Axios } from 'axios';
import { Injectable } from '@nestjs/common';
import { NoEnvVarError } from '../../../error';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class NaverSmsService {
  private ncpInstance: Axios;
  private senderPhoneNumber: string;
  private iamAccessKey: string;
  private iamSecretKey: string;
  private smsServiceId: string;

  constructor() {
    const {
      SMS_SENDER_PHONE_NUMBER,
      NCP_IAM_ACCESS_KEY,
      NCP_IAM_SECRET_KEY,
      NCP_SNS_SERVICE_ID,
    } = process.env;

    if (
      !SMS_SENDER_PHONE_NUMBER ||
      !NCP_IAM_ACCESS_KEY ||
      !NCP_IAM_SECRET_KEY ||
      !NCP_SNS_SERVICE_ID
    ) {
      throw new NoEnvVarError();
    }

    this.senderPhoneNumber = SMS_SENDER_PHONE_NUMBER;
    this.iamAccessKey = NCP_IAM_ACCESS_KEY;
    this.iamSecretKey = NCP_IAM_SECRET_KEY;
    this.smsServiceId = NCP_SNS_SERVICE_ID;
    this.ncpInstance = axios.create({
      baseURL: this.buildSmsSendUrl(),
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(content, phoneNumber) {
    const body = this.buildSendMessageBody(content, phoneNumber);
    const payload = JSON.stringify(body);
    const timestamp = Date.now();
    const signature = this.buildSignature(timestamp);

    let response;
    try {
      response = await this.ncpInstance.post('', payload, {
        headers: {
          'x-ncp-apigw-timestamp': timestamp,
          'x-ncp-iam-access-key': this.iamAccessKey,
          'x-ncp-apigw-signature-v2': signature,
        },
      });
    } catch (err) {
      const { data } = err.response;
      console.log('NCP SMS servier error', data);
      throw err;
    }
    return response.data;
  }

  buildSignature(timestamp) {
    const space = ' '; // one space
    const newLine = '\n'; // new line
    const method = 'POST'; // method
    const url = `/sms/v2/services/${this.smsServiceId}/messages`;

    const hmac = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      this.iamSecretKey,
    );
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp.toString());
    hmac.update(newLine);
    hmac.update(this.iamAccessKey);

    const hash = hmac.finalize();

    return hash.toString(CryptoJS.enc.Base64);
  }

  buildSendMessageBody(content, phoneNumber) {
    return {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: this.senderPhoneNumber,
      content,
      messages: [
        {
          to: phoneNumber,
          content,
        },
      ],
    };
  }

  buildSmsSendUrl() {
    return `https://sens.apigw.ntruss.com/sms/v2/services/${this.smsServiceId}/messages`;
  }
}
