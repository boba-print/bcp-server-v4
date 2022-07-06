import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [PrismaService],
})
export class FileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(FileController);
  }
}
