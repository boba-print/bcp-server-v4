import { Cards } from '@prisma/client';

export class CardPaymentFailedError {
  constructor(public readonly message: string, public readonly card: Cards) {}
}
