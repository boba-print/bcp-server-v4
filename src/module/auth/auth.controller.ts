import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PrismaService } from 'src/service/prisma.service';
import { Request } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PhoneAuthSendMessageDto } from './dto/PhoneAuthSendMessage.dto';
import { PhoneAuthSessionService } from './service/phone-auth-session.service';

// TODO: use guards
@Controller('auth')
export class KiosksController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly phoneAuthSessionService: PhoneAuthSessionService,
  ) {}

  @Post('phone-auth/send-message')
  async findUnique(
    @Req()
    req: Request,
  ) {
    const dto = plainToClass(PhoneAuthSendMessageDto, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 401);
    }

    await this.phoneAuthSessionService.sendSms(dto.phoneNumber);
    return;
  }

  @Post('phone-auth/verify')
  async update(
    @Req()
    req: Request,
  ) {
    // auth
  }
}
