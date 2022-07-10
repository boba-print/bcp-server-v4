import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { FileMapper } from './mapper/file.mapper';
import { KioskMapper } from './mapper/kiosk.mapper';
import { PrintTicketMapper } from './mapper/print-ticket.mapper';
import { PrintJobController } from './print-job.controller';
import { CreatePrintJobService } from './service/create-print-job.service';
import { GetPrintJobService } from './service/get-print-job.service';

@Module({
  controllers: [PrintJobController],
  providers: [
    PrismaService,
    CreatePrintJobService,
    GetPrintJobService,
    PrintTicketMapper,
    FileMapper,
    KioskMapper,
  ],
})
export class PrintJobModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(PrintJobController);
  }
}
