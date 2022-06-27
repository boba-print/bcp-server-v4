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

// TODO: use guards
@Controller('auth')
export class KiosksController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('phone-auth/send-message')
  async findUnique(
    @Req()
    req: Request,
  ) {
    // auth
  }

  @Post('phone-auth/verify')
  async update(
    @Req()
    req: Request,
  ) {
    // auth
  }
}
