import { Test } from '@nestjs/testing';
import { NaverSmsService } from '../naver-sms.service';

describe('NaverSmsService test', () => {
  let smsService: NaverSmsService;

  beforeEach(async () => {
    smsService = new NaverSmsService();
  });

  describe('Send SMS', () => {
    it('should send message', async () => {
      expect(await smsService.sendMessage('test', '01033891886')).toBeTruthy();
    });
  });
});
