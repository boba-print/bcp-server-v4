import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { PrintController } from './controller/print.controller';
import { KioskAuthMiddleware } from '../../common/middleware/kiosk-auth.middleware';
import { PrintOrderService } from './service/PrintOrder.service';
import { GCSService } from 'src/service/GCS.service';

@Module({
  controllers: [PrintController],
  providers: [PrismaService, PrintOrderService, GCSService],
})
export class PrintModule {
  // 키오스크 객체를 req 에 담아서 가져온다
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(KioskAuthMiddleware).forRoutes(PrintController);
  }
}
