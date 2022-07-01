import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { UserController } from './user.controller';
import { CreateUserService } from './service/create-user.service';
import { PrismaService } from 'src/service/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard,
    },
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(UserController);
  }
}
