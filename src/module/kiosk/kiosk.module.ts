import { MiddlewareConsumer, Module } from '@nestjs/common';
import { KioskAuthMiddleware } from '../../common/middleware/kiosk-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { KiosksController } from './controller/kiosk.controller';
import { PrintController } from '../print/controller/print.controller';
import { GCSService } from 'src/service/GCS.service';

@Module({
  controllers: [KiosksController],
  providers: [PrismaService, GCSService],
})
export class KioskModule {
  // 키오스크 객체를 req 에 담아서 가져온다
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KioskAuthMiddleware)
      .forRoutes(KiosksController, PrintController);
  }
}
