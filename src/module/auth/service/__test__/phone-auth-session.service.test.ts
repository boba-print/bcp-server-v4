import { Test } from '@nestjs/testing';
import { PhoneAuthSessionService } from '../phone-auth-session.service';
import { NaverSmsService } from '../naver-sms.service'; 

describe('PhoneAuthSessionService', () => {
  let phoneAuthSessionService: PhoneAuthSessionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [NaverSmsService],
    }).compile();

    phoneAuthSessionService = moduleRef.get<PhoneAuthSessionService>(
      PhoneAuthSessionService,
    );
  });
});
