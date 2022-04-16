import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { CardTransactionBuilder } from 'src/domain/CardTransaction/CardTransaction.builder';
import { UserEntity } from 'src/domain/User/User.entity';

type IamportResponse = {
  code: number;
  message: string;
  response: {
    imp_uid: string;
    receipt_url: string;
  };
};

@Injectable()
export class CardPurchaseService {
  private iamport = axios.create({
    baseURL: 'https://api.iamport.kr',
    timeout: 5000,
  });
  private imp_key = process.env.IAMPORT_KEY;
  private imp_secret = process.env.IAMPORT_SECRET;
  private access_token: string | null = null;
  private expired_at: Date;

  getToken() {
    return this.iamport.post('/users/getToken', {
      imp_key: this.imp_key,
      imp_secret: this.imp_secret,
    });
  }

  async refreshTokenWhenExpired() {
    if (this.access_token && this.expired_at && this.expired_at > new Date()) {
      return;
    }

    await this.getToken().then((res) => {
      this.access_token = res.data.response.access_token;
      this.expired_at = new Date(res.data.response.expired_at * 1000);
    });
  }

  async purchase(price: number, user: UserEntity) {
    await this.refreshTokenWhenExpired();

    const card = user.selectCard();
    const body = {
      customer_uid: card.BillingKey,
      amount: price,
      name: 'Boba Cloud Print Server v4',
      buyer_name: user.props.Name,
      buyer_email: user.props.Email,
      buyer_tel: user.props.PhoneNumber,
    };

    const { data } = await this.iamport.post<IamportResponse>(
      '/subscribe/payments/again',
      body,
      {
        headers: {
          Authorization: this.access_token as string,
        },
      },
    );

    return new CardTransactionBuilder()
      .setAmount(price)
      .setCardId(card.CardID)
      .setRejectedReason(data.code !== 0 ? data.message : null)
      .setIamportUid(data.response.imp_uid)
      .setReceiptUrl(data.response.receipt_url)
      .setUserId(user.props.UserID)
      .build();
  }
}
export const cardPurchaseService = new CardPurchaseService();
