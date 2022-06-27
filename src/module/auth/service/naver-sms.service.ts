import axios, { Axios } from 'axios';
import { Injectable } from '@nestjs/common';
import { InvalidParams, NoEnvVarError } from '../../../error';
import * as CryptoJS from 'crypto-js';
import { phone } from 'phone';

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

  /**
   * 헤당 휴대폰 번호로 문자메시지를 전송합니다.
   * @param content : 문자 메시지 내용
   * @param phoneNumber : 문자를 보낼 휴대전화번호
   * @returns Naver Cloud API response body
   */
  async sendMessage(content: string, phoneNumber: string) {
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

  private buildSignature(timestamp) {
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

  private buildSendMessageBody(content, phoneNumber) {
    const countryCode = this.parseCountryCode(phoneNumber);
    const to = phoneNumber;
    return {
      type: 'SMS',
      contentType: 'COMM',
      countryCode,
      from: this.senderPhoneNumber,
      content,
      messages: [
        {
          to,
          content,
        },
      ],
    };
  }

  private buildSmsSendUrl() {
    return `https://sens.apigw.ntruss.com/sms/v2/services/${this.smsServiceId}/messages`;
  }

  /**
   * E.164 포멧의 휴대폰 번호에서 지역코드를 파싱함
   */
  private parseCountryCode(phoneNumber: string) {
    const result = phone(phoneNumber);
    if (!result || !result.isValid) {
      throw new InvalidParams('phone number is not E.164 format');
    }
    return result.countryCode.replace('+', '');
  }

  /**
   * E.164 포멧의 휴대폰 번호에서 010 으로 시작되는 휴대폰 번호 생성
   */
  private buildPlainPhoneNumber(phoneNumber: string) {
    const result = phone(phoneNumber);
    if (!result || !result.isValid) {
      throw new InvalidParams('phone number is not E.164 format');
    }
    return '0' + phoneNumber.replace(result.countryCode, ''); // 지역 코드를 없애고 앞에 0 을 붙임.
  }
}
