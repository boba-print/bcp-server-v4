export interface PointTransactionProps {
  PointTransactionID: string;
  CreatedAt: Date;
  CardTransactionID: string | null;
  Context: string;
  UserID: string;
  PointChanged: number;
  CanceledAmount: number;
  CanceledAt: Date | null;
  RemainingPoint: number;
}

export class PointTransactionEntity {
  props: PointTransactionProps;

  constructor(props: PointTransactionProps) {
    this.props = props;
  }
}
