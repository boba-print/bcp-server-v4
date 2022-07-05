import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { KioskModule } from './module/kiosk/kiosk.module';
import { PreauthMiddleware } from './common/middleware/preauth.middleware';
import { ClientModule } from './module/client/client.module';
import { PublicModule } from './module/public/public.module';
import { UserModule } from './module/user/user.module';
import { NoticesModule } from './module/notice/notice.module';

@Module({
  controllers: [AppController],
  providers: [],
  imports: [UserModule, KioskModule, NoticesModule],
})
export class AppModule implements NestModule {
  // Firebase auth 를 통해 user uid (또는 kiosk uid 를 얻기 위한 미들웨어)
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
