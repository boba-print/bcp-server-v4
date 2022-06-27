import { Test } from '@nestjs/testing';
import { NaverSmsService } from '../naver-sms.service';

describe('CatsController', () => {
  let smsService: NaverSmsService;

  beforeEach(async () => {
    smsService = new NaverSmsService();
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      expect(await smsService.sendMessage('test', '01033891886')).toBeTruthy();
    });
  });
});
