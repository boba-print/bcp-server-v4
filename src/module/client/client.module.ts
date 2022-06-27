import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/service/prisma.service';
import { UserAuthMiddleWare } from '../../common/middleware/user-auth.middleware';
import { AlarmController } from './controller/alarm/alarm.controller';
import { UserAuthGuard } from '../../common/guard/UserAuth.guard';
import { AlarmService } from './service/alarm.service';
import { PrintOrderService } from './service/print-order/print-order.service';

@Module({
  controllers: [AlarmController],
  providers: [
    AlarmService,
    PrismaService,
    PrintOrderService,
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard,
    },
  ],
})
export class ClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(AlarmController);
  }
}
