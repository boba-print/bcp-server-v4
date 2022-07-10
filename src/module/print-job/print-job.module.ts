import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PrintJobController } from './print-job.controller';
import { CreatePrintJobService } from './service/create-print-job.service';
import { GetPrintJobService } from './service/get-print-job.service';

@Module({
  controllers: [PrintJobController],
  providers: [PrismaService, CreatePrintJobService, GetPrintJobService],
})
export class PrintJobModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(PrintJobController);
  }
}
