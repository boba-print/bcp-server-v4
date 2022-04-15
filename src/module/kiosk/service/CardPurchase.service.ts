import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UserEntity } from 'src/domain/User/User.entity';

@Injectable()
export class CardPurchaseService {
  private iamport = axios.create({
    baseURL: 'https://api.iamport.kr',
    timeout: 5000,
    headers: { 'X-Custom-Header': 'foobar' },
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
      name: 'Boba Print Server v4',
      buyer_name: user.props.Name,
      buyer_email: user.props.Email,
      buyer_tel: user.props.PhoneNumber,
    };
    await this.iamport.post('/subscribe/payments/again', body, {
      headers: {
        Authorization: this.access_token as string,
      },
    });
  }
}
export const cardPurchaseService = new CardPurchaseService();
