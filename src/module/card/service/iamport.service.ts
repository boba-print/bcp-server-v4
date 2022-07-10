import { Injectable } from '@nestjs/common';
import { CardCreateDto } from '../dto/CardCreate.dto';
import axios from 'axios';
import { InvalidEnv } from 'src/common/error';
import { IamportGetTokenError, IamportSubscribeError } from '../error';
import { IamportGetTokenResponse } from '../dto/IamportGetTokenResponse.dto';
import { IamportSubscribeResponseDto } from '../dto/IamportSubscribeResponse.dto';

@Injectable()
export class IamportService {
  private BASE_URL = 'https://api.iamport.kr';
  private IMP_REST_API: string;
  private IMP_API_SECRET: string;

  private accessToken: string | null = null;
  private expireAt: Date;

  constructor() {
    const { IMP_CODE, IMP_REST_API, IMP_API_SECRET } = process.env;

    if (!IMP_CODE || !IMP_REST_API || !IMP_API_SECRET) {
      throw new InvalidEnv('Iamport env missed');
    }

    this.IMP_REST_API = IMP_REST_API;
    this.IMP_API_SECRET = IMP_API_SECRET;
  }

  async addSubscriber(customerId: string, dto: CardCreateDto) {
    const options = await this.getAuthenticatedAxiosOptions();
    const response = await axios
      .post<IamportSubscribeResponseDto>(
        `subscribe/customer/${customerId}`,
        {
          card_number: dto.cardNumber,
          expiry: dto.expiry,
          birth: dto.birth,
          pwd_2digit: dto.pwd2digit,
        },
        options,
      )
      .catch((error) => {
        throw new IamportSubscribeError(error.message);
      });

    const { data } = response;
    if (data.code !== 0) {
      throw new IamportSubscribeError(data.message);
    }

    return data;
  }

  private async fetchToken() {
    const response = await axios
      .post<IamportGetTokenResponse>(
        'users/getToken',
        {
          imp_key: this.IMP_REST_API,
          imp_secret: this.IMP_API_SECRET,
        },
        { baseURL: this.BASE_URL },
      )
      .catch((err) => {
        throw new IamportGetTokenError(err.message);
      });
    const dto = response.data;
    if (dto.code !== 0) {
      throw new IamportGetTokenError(dto.message);
    }

    this.accessToken = dto.response.access_token;
    this.expireAt = new Date((dto.response.expired_at - 60) * 1000); // 토큰 만료 1분전에 미리 refresh 하기 위해
  }

  private async getAuthenticatedAxiosOptions() {
    if (this.isTokenAvailable) {
      await this.fetchToken();
    }

    return {
      baseURL: this.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  private get isTokenAvailable() {
    if (!this.accessToken) {
      return false;
    }

    if (this.expireAt < new Date()) {
      return false;
    }
    return true;
  }
}
