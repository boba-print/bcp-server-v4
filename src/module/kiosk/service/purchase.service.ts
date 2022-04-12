import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchaseService {
  purchasePrintJob(): string {
    return 'Hello World!';
  }
}
