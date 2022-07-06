import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PrintJobController } from './print-job.controller';
import { PrintJobService } from './service/print-job.service';

@Module({
  controllers: [PrintJobController],
  providers: [PrismaService, PrintJobService],
})
export class PrintJobModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(PrintJobController);
  }
}
