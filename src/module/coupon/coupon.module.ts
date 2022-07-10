import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { CouponController } from './coupon.controller';
import { CouponService } from './service/coupon.service';

@Module({
  controllers: [CouponController],
  providers: [PrismaService, CouponService],
})
export class CouponModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(CouponController);
  }
}
