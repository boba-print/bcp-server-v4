import { Injectable } from '@nestjs/common';
import { CreateCardDto } from '../dto/CreateCard.dto';
import axios from 'axios';
import { InvalidEnv } from 'src/common/error';
import {
  IamportAuthorizeError,
  IamportGetTokenError,
  IamportUnknownError,
} from '../error';
import { IamportGetTokenResponse } from '../dto/IamportGetTokenResponse.dto';
import { IamportSubscribeResponseDto } from '../dto/IamportSubscribeResponse.dto';
import { IamportPurchaseRequestDto } from '../dto/IamportPurchaseRequest.dto';
import { IamportPurchaseResponseDto } from '../dto/IamportPurchaseResponse.dto';
import { IamportCancelResponseDto } from '../dto/IamportCancelResponse.dto';
import { IamportCancelRequestDto } from '../dto/IamportCancelRequest.dto';

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

  async addSubscriber(customerId: string, dto: CreateCardDto) {
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
      .catch((err) => {
        if (err.response || err.response.status === 401) {
          throw new IamportAuthorizeError(err.message);
        }

        throw new IamportUnknownError(err.message);
      });

    const { data } = response;
    return data;
  }

  async purchase(reqDto: IamportPurchaseRequestDto) {
    const options = await this.getAuthenticatedAxiosOptions();
    const response = await axios
      .post<IamportPurchaseResponseDto>(
        'subscribe/payments/again',
        reqDto,
        options,
      )
      .catch((err) => {
        if (err.response || err.response.status === 401) {
          throw new IamportAuthorizeError(err.message);
        }

        throw new IamportUnknownError(err.message);
      });

    const { data } = response;
    return data;
  }

  async cancel(reqDto: IamportCancelRequestDto) {
    const options = await this.getAuthenticatedAxiosOptions();
    const response = await axios
      .post<IamportCancelResponseDto>('/payments/cancel', reqDto, options)
      .catch((err) => {
        if (err.response || err.response.status === 401) {
          throw new IamportAuthorizeError(err.message);
        }

        throw new IamportUnknownError(err.message);
      });

    const { data } = response;
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
    this.expireAt = new Date((dto.response.expired_at - 60) * 1000); // ?????? ?????? 1????????? ?????? refresh ?????? ??????
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
