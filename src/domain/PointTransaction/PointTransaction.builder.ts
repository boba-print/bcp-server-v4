import { PointTransactions, Users } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Context } from './Context.enum';
import { instanceToPlain } from 'class-transformer';
import { PointTransactionEntity, PointTransactionProps } from './PointTransaction.entity';

export class PointTransactionBuilder implements PointTransactionProps {
  PointTransactionID: string;
  CreatedAt: Date;
  CardTransactionID: string | null;
  Context: string;
  UserID: string;
  PointChanged: number;
  CanceledAmount: number;
  CanceledAt: Date | null;
  RemainingPoint: number;

  constructor() {
    this.PointTransactionID = uuidv4();
    this.CanceledAmount = 0;
    this.CanceledAt = null;
  }

  setContext(context: Context) {
    this.Context = context;
    return this;
  }

  setUserId(userId: string) {
    this.UserID = userId;
    return this;
  }

  setPointChanged(pointChanged: number) {
    this.PointChanged = pointChanged;
    return this;
  }

  setRemainingPoint(remainingPoint: number) {
    this.RemainingPoint = remainingPoint;
    return this;
  }

  build() {
    const props = instanceToPlain(this) as PointTransactionProps;
    return new PointTransactionEntity(props);
  }
}
