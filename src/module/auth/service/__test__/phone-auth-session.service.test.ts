import { Test } from '@nestjs/testing';
import { PhoneAuthSessionService } from '../phone-auth-session.service';
import { NaverSmsService } from '../naver-sms.service'; 

describe('CatsController', () => {
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

  describe('', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(catsService, 'findAll').mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
