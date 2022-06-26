import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/service/prisma.service';
import { ClientAuthMiddleWare } from './client-auth.middleware';
import { AlarmController } from './controller/alarm/alarm.controller';
import { IsAuthorizedWithClientIdGuard } from './guard/IsAuthorizedWithClientId.guard';
import { PrintOrderService } from './service/print-order/print-order.service';

@Module({
  controllers: [AlarmController],
  providers: [
    PrismaService,
    PrintOrderService,
    {
      provide: APP_GUARD,
      useClass: IsAuthorizedWithClientIdGuard,
    },
  ],
})
export class ClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientAuthMiddleWare).forRoutes(AlarmController);
  }
}
