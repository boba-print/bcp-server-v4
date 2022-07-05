import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { UserController } from './user.controller';
import { CreateUserService } from './service/create-user.service';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateUserService } from './service/update-user.service';
import { PhoneAuthSessionService } from '../auth/service/phone-auth-session.service';
import { NaverSmsService } from '../auth/service/naver-sms.service';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserService,
    UpdateUserService,
    PrismaService,
    // TODO: Auth 모듈을 한번에 불러올수는 없을까?
    PhoneAuthSessionService,
    NaverSmsService,
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(UserController);
  }
}
