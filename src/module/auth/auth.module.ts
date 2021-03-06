import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { AuthController } from '../client/controller/auth/auth.controller';
import { NaverSmsService } from './service/naver-sms.service';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, NaverSmsService],
})
export class AuthModule {
  // 키오스크 객체를 req 에 담아서 가져온다
}
