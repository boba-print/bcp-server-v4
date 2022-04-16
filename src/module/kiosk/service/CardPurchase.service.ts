import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CardTransactionBuilder } from 'src/domain/CardTransaction/CardTransaction.builder';
import { UserEntity } from 'src/domain/User/User.entity';

type IamportResponse = {
  code: number;
  message: string;
  response: {
    imp_uid: string;
    paid_at: number;
    failed_at: number;
    cancelled_at: number;
    receipt_url: string;
  };
};

const PAYMENT_NAME = '보바 클라우드 프린트 결제서비스 (v4)';

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
    // access token 이 없거나 access token 의 만료가 1분 이하로 남았으면 새로 가져온다.
    if (
      this.access_token &&
      this.expired_at &&
      this.expired_at > new Date(Date.now() - 1000 * 60)
    ) {
      return;
    }

    await this.getToken().then((res) => {
      this.access_token = res.data.response.access_token;
      this.expired_at = new Date(res.data.response.expired_at * 1000);
    });
  }

  /**
   * 결제 요청
   * 결제 실패 할 경우 -> rejectedReason 이 null 이 아님
   * 100원 이하 결제 일 경우 -> 100원 결제 후 초과 금액 부분환불 -> canceledAmount 이 0 이 아님
   * 결제 실패한 요청은 DB 에 등록하면 안됨.
   */
  async purchase(price: number, user: UserEntity) {
    await this.refreshTokenWhenExpired();

    const toPay = price < 100 ? 100 : price; // 카드사 정책으로 100원 미만 결제 불가
    const toRefund = price - toPay; // 100원 이하 결제 요청은 100원을 결제하고 추가금액은 부분환불 한다.

    const card = user.selectCard();
    const body = {
      customer_uid: card.BillingKey,
      amount: toPay,
      name: PAYMENT_NAME,
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

    let refundData: IamportResponse | null = null;
    if (toRefund !== 0) {
      const body = {
        imp_uid: data.response.imp_uid,
        amount: toRefund,
      };
      const d = await this.iamport.post<IamportResponse>(
        '/payments/refund',
        body,
        {
          headers: {
            Authorization: this.access_token as string,
          },
        },
      );
      refundData = d.data;
    }

    const builder = new CardTransactionBuilder();
    builder
      .setAmount(price)
      .setCardId(card.CardID)
      .setRejectedReason(data.code !== 0 ? data.message : null)
      .setUserId(user.props.UserID);

    if (data.code === 0) {
      // 정상 결제이면 결제 정보를 저장한다.
      builder
        .setCreatedAt(
          new Date((data.response.paid_at || data.response.failed_at) * 1000),
        )
        .setIamportUid(data.response.imp_uid)
        .setReceiptUrl(data.response.receipt_url);
    }

    if (refundData) {
      builder
        .setCanceledAmount(toRefund)
        .setCanceledAt(new Date(refundData.response.cancelled_at * 1000));
    }

    return builder.build();
  }
}
export const cardPurchaseService = new CardPurchaseService();
