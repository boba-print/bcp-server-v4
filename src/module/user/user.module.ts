import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { UserController } from './user.controller';
import { PrismaService } from 'src/service/prisma.service';
import { PhoneAuthSessionService } from '../auth/service/phone-auth-session.service';
import { NaverSmsService } from '../auth/service/naver-sms.service';
import { UserService } from './service/user.service';
import { PrintOrderService } from './service/print-order.service';
import { AlarmService } from './service/alarm.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    PrintOrderService,
    // TODO: Auth 모듈을 한번에 불러올수는 없을까?
    PhoneAuthSessionService,
    NaverSmsService,
    AlarmService,
  ],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(UserController);
  }
}
