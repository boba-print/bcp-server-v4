import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { NotFoundError } from 'src/common/error';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CouponService {
  constructor(readonly prismaService: PrismaService) {}
  async updateCoupon(userId: string, couponId: string) {
    const now = new Date();
    const coupon = await this.prismaService.coupons.update({
      where: {
        CouponID: couponId,
      },
      data: {
        UsedAt: now,
        UsedUserID: userId,
      },
    });
    if (!coupon) {
      throw new NotFoundError('Coupon Not Found!!');
    }

    return coupon;
  }

  async updatePointTransactions(userId: string, amount: number) {
    const pointChanged = 0 - amount;
    const now = new Date();

    const pointTransactions = await this.prismaService.pointTransactions.create(
      {
        data: {
          PointTransactionID: uuidV4(),
          CreatedAt: now,
          Context: 'PRINT',
          UserID: userId,
          PointChanged: pointChanged,
          CanceledAmount: 0,
          RemainingPoint: -1,
        },
      },
    );
    return pointTransactions;
  }

  async updateUser(userId: string, amount: number) {
    const points = await this.prismaService.users.findUnique({
      where: {
        UserID: userId,
      },
      select: {
        Points: true,
      },
    });
    let Points = 0;
    if (points) {
      Points = points.Points + amount;
    }
    const user = await this.prismaService.users.update({
      where: {
        UserID: userId,
      },
      data: {
        Points,
      },
    });
    return user;
  }
}
