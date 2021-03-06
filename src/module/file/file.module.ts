import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { FileController } from './file.controller';
import { FileService } from './service/file.service';

@Module({
  controllers: [FileController],
  providers: [PrismaService, FileService],
})
export class FileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(FileController);
  }
}
