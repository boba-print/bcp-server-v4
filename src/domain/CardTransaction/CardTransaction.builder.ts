import { v4 as uuidv4 } from 'uuid';
import {
  CardTransactionEntity,
  CardTransactionProps,
} from './CardTransaction.entity';

export class CardTransactionBuilder {
  props: Partial<CardTransactionProps>;
  constructor() {
    this.props.CardTransactionID = uuidv4();
    this.props.CreatedAt = new Date();
    this.props.CanceledAmount = 0;
    this.props.CanceledAt = null;
    this.props.RejectedReason = null;
  }

  setCreatedAt(createdAt: Date) {
    this.props.CreatedAt = createdAt;
    return this;
  }

  setAmount(amount: number) {
    this.props.Amount = amount;
    return this;
  }

  setCanceledAmount(amount: number) {
    this.props.CanceledAmount = amount;
    return this;
  }

  setCanceledAt(canceledAt: Date) {
    this.props.CanceledAt = canceledAt;
    return this;
  }

  // 거래 불가 사유가 있을 경우 string 아니면 null
  setRejectedReason(reason: string | null) {
    this.props.RejectedReason = reason;
    return this;
  }

  setCardId(cardId: string) {
    this.props.CardID = cardId;
    return this;
  }

  setIamportUid(impUid: string) {
    this.props.IamportUID = impUid;
    return this;
  }

  setReceiptUrl(receiptUrl: string) {
    this.props.ReceiptURL = receiptUrl;
    return this;
  }

  setUserId(userId: string) {
    this.props.UserID = userId;
    return this;
  }

  build() {
    return new CardTransactionEntity(this.props as CardTransactionProps);
  }
}
