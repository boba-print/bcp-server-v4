import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateCouponDto } from './dto/coupon.dto';
import { CouponService } from './service/coupon.service';

@Controller('users')
export class CouponController {
  constructor(
    readonly prismaService: PrismaService,
    readonly couponService: CouponService,
  ) {}

  @Post(':userId/coupon/submit')
  @UseGuards(UserAuthGuard)
  async update(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(UpdateCouponDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }
    console.log(userId);

    const coupon = await this.couponService.updateCoupon(userId, dto.couponId);
    const pointTransactons = await this.couponService.updatePointTransactions(
      userId,
      coupon.Amount,
    );
    const user = await this.couponService.updateUser(userId, coupon.Amount);

    return { coupon, pointTransactons, user };
  }
}
