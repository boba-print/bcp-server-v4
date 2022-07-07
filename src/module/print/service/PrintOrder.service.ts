import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { UserEntity } from 'src/domain/User/User.entity';
import { PrismaService } from 'src/service/prisma.service';
import { PointTransactionEntity } from 'src/domain/PointTransaction/PointTransaction.entity';
import { CardTransactionEntity } from 'src/domain/CardTransaction/CardTransaction.entity';
import { PrintJobEntity } from 'src/domain/PrintJob/PrintJob.entity';
import { KioskEntity } from 'src/domain/Kiosk/Kiosk.entity';

enum PrintOrderStatus {
  Paid = 'PAID',
}

@Injectable()
export class PrintOrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async persistPrintOrderResult(
    user: UserEntity,
    printJobs: PrintJobEntity[],
    cardTransaction: CardTransactionEntity | null,
    pointTransaction: PointTransactionEntity | null,
    kiosk: KioskEntity,
  ) {
    const awaiter: Promise<any>[] = [];

    // update user (포인트 사용 반영)
    awaiter.push(
      this.prismaService.users.update({
        where: {
          UserID: user.props.UserID,
        },
        data: user.props,
      }),
    );

    // delete print job
    printJobs.forEach((pj) => {
      awaiter.push(
        this.prismaService.printJobs.update({
          where: {
            PrintJobID: pj.props.PrintJobID,
          },
          data: {
            IsDeleted: 1,
          },
        }),
      );
    });

    // create print order (cardTransaction 과 pointTransaction 을 포함함.)
    awaiter.push(
      this.prismaService.printOrders.create({
        data: {
          PrintOrderID: uuidv4(),
          CreatedAt: new Date(),
          ModifiedAt: new Date(),
          IsDeleted: 0,
          PointTransactions: pointTransaction
            ? {
                create: pointTransaction.props,
              }
            : undefined,
          CardTransactions: cardTransaction
            ? {
                create: cardTransaction.props,
              }
            : undefined,
          Status: PrintOrderStatus.Paid,
          Kiosks: {
            connect: {
              KioskID: kiosk.props.KioskID,
            },
          },
          Users: {
            connect: {
              UserID: user.props.UserID,
            },
          },
        },
      }),
    );

    await Promise.all(awaiter);
  }
}
