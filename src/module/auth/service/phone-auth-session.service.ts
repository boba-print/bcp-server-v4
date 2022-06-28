import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { NaverSmsService } from './naver-sms.service';

@Injectable()
export class PhoneAuthSessionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly naverSmsService: NaverSmsService,
  ) {}

  /**
   * 지정된 휴대폰 번호로 인증번호를 보낸다.
   * @param phoneNumber +82... 형태의 전화번호
   */
  async sendSms(phoneNumber: string) {
    const verifyNumber = this.generateRandomVerifyNumber();
    const session = await this.prismaService.phoneAuthSession.create({
      data: {
        PhoneAuthSessionID: uuidv4(),
        CreatedAt: new Date(),
        PhoneNumber: phoneNumber,
        VerifyNumber: verifyNumber,
      },
    });

    const content = this.buildSmsText(verifyNumber);
    await this.naverSmsService.sendMessage(content, phoneNumber);

    return session;
  }

  /**
   * 세션 테이블을 확인해서 해당하는 인증이 있는지 확인하고
   * 해당 세션이 5분을 초과하지 않았는지 확인한다.
   * @param phoneNumber : 휴대폰 번호
   * @param verifyNumber : 인증번호 6자리
   * @return : { isSuccess: true | false }
   */
  async verify(phoneNumber: string, verifyNumber: string) {
    const session = await this.prismaService.phoneAuthSession.findFirst({
      where: {
        PhoneNumber: phoneNumber,
        VerifyNumber: verifyNumber,
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    const result = {
      isSuccess: false,
    };
    if (!session) {
      return result;
    }
    // 5분이 초과된 세션은 버린다.
    const FIVE_MIN = 5 * 60 * 1000;
    if (session.CreatedAt < new Date(Date.now() - FIVE_MIN)) {
      return result;
    }
    // 인증 성공!
    result.isSuccess = true;
    return result;
  }

  private generateRandomVerifyNumber() {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    return randomNumber.toString();
  }

  private buildSmsText(verifyNumber: string) {
    return `보바 휴대폰 인증번호입니다. [${verifyNumber}]`;
  }
}
