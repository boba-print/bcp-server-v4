import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { PrintJobController } from './printjob.controller';

@Module({
  controllers: [PrintJobController],
  providers: [PrismaService],
})
export class PrintJobModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(PrintJobController);
  }
}
