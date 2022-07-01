import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { UserController } from './user.controller';
import { CreateUserService } from './service/create-user.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [UserController],
  providers: [CreateUserService, PrismaService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(UserController);
  }
}
