import { Controller, HttpException, Post, Req } from '@nestjs/common';

import { Request } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { PhoneAuthSessionService } from './service/phone-auth-session.service';
import { PhoneAuthSendMessageDto } from './dto/PhoneAuthSendMessage.dto';
import { PhoneAuthVerifyDto } from './dto/PhoneAuthVerify.dto';
import { PhoneAuthVerifyResultDto } from './dto/PhoneAuthVerifyResult.dto';

// TODO: use guards
@Controller('auth')
export class AuthController {
  constructor(
    private readonly phoneAuthSessionService: PhoneAuthSessionService,
  ) {}

  @Post('phone-auth/send-message')
  async sendMessage(
    @Req()
    req: Request,
  ) {
    const dto = plainToClass(PhoneAuthSendMessageDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    await this.phoneAuthSessionService.sendSms(dto.phoneNumber);
    return;
  }

  @Post('phone-auth/verify')
  async verify(
    @Req()
    req: Request,
  ): Promise<PhoneAuthVerifyResultDto> {
    const dto = plainToClass(PhoneAuthVerifyDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const result = await this.phoneAuthSessionService.verify(
      dto.phoneNumber,
      dto.verifyNumber,
    );

    return result;
  }
}
