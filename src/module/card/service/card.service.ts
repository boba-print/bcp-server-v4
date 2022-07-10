import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateCardDto } from '../dto/CreateCard.dto';
import { IamportService } from './iamport.service';
import { v4 as uuidv4 } from 'uuid';
import {
  IamportAuthorizeError,
  IamportGetTokenError,
  IamportSubscribeError,
  IamportUnknownError,
} from '../error';
import { IamportSubscribeResponseDto } from '../dto/IamportSubscribeResponse.dto';
import { response } from 'express';
import { Cards } from '@prisma/client';
import { SHA256 } from 'crypto-js';
import { Priority } from '../type';

@Injectable()
export class CardService {
  private NONCE =
    '389E664BA322288EA3644F54531F8DBF4FC6853129C73AB7E8E516D2F48C2CEF';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly iamportService: IamportService,
  ) {}

  async create(userId: string, dto: CreateCardDto) {
    const customerId = uuidv4();
    const cardId = uuidv4();

    let response: IamportSubscribeResponseDto;
    try {
      response = await this.iamportService.addSubscriber(customerId, dto);
    } catch (err) {
      // TODO: 에러 처리는 AOP 를 통해 처리하는것이 좋음
      if (
        err instanceof IamportUnknownError ||
        err instanceof IamportGetTokenError ||
        err instanceof IamportAuthorizeError
      ) {
        // TODO: sentry 에러 리포트를 보내야 함.
        console.error(err);
      }
      throw err;
    }

    const checkSum = SHA256(dto.cardNumber).toString();
    const billingKey = SHA256(
      `${userId}-${checkSum}-${dto.expiry}-${dto.birth}-${dto.pwd2digit}-${this.NONCE}`,
    ).toString();
    const cardRelation: Cards = {
      CardID: cardId,
      CreatedAt: new Date(),
      ModifiedAt: new Date(),
      IsDeleted: 0,
      CheckSum: checkSum,
      RejectionMessage: null,
      MaskedNumber: response.response.card_number,
      Priority: Priority.First,
      VendorCode: response.response.card_code,
      BillingKey: billingKey,
      UserID: userId,
    };

    await this.prismaService.cards.create({
      data: cardRelation,
    });

    return response;
  }
}
