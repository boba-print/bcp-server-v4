export interface CardTransactionProps {
  CardTransactionID: string;
  CreatedAt: Date;
  Amount: number;
  CanceledAmount: number;
  CanceledAt: Date | null;
  RejectedReason: string | null;
  CardID: string | null;
  IamportUID: string;
  ReceiptURL: string;
  UserID: string;
}

export class CardTransactionEntity {
  props: CardTransactionProps;
  constructor(props: CardTransactionProps) {
    this.props = props;
  }
}
