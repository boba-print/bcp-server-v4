import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { KioskAuthMiddleware } from './kiosk-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { KiosksController } from './controller/kiosk.controller';
import { PrintController } from './controller/print.controller';
import { IsAuthorizedWithKioskIdGuard } from './guard/IsAuthorizedWithKioskId.guard';
import { PrintOrderService } from './service/PrintOrder.service';
import { GCSService } from './service/GCS.service';
@Module({
  controllers: [KiosksController, PrintController],
  providers: [
    PrismaService,
    PrintOrderService,
    GCSService,
    {
      provide: APP_GUARD,
      useClass: IsAuthorizedWithKioskIdGuard,
    },
  ],
})
export class KioskModule {
  // 키오스크 객체를 req 에 담아서 가져온다
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KioskAuthMiddleware)
      .forRoutes(KiosksController, PrintController);
  }
}
