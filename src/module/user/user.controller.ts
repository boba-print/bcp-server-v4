import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { IsUserExistsDto } from './dto/IsUserExists.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { CreateUserService } from './service/create-user.service';
import { UpdateUserService } from './service/update-user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly prismaService: PrismaService,
  ) {}
  @Post('create')
  async create(@Body() body: any) {
    const dto = plainToInstance(CreateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    // TODO: PhoneAuthSession 에서 최근에 휴대폰 인증이 되었는지 확인해야 함.
    const isOverlapResult = await this.createUserService.checkUserOverlap(dto);
    if (
      isOverlapResult.isEmailOverlap ||
      isOverlapResult.isPhoneNumberOverlap
    ) {
      throw new HttpException('User info conflict', 409);
    }

    const user = await this.createUserService.create(dto);
    return user;
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  async findUnique(
    @Param()
    params,
  ) {
    const user = await this.prismaService.users.findUnique({
      where: {
        UserID: params.id,
      },
    });
    return user;
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  async patch(@Param() params, @Body() body: any) {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const isOverlapResult = await this.updateUserService.isPhoneNumber(dto);
    if (isOverlapResult.isPhoneNumberOverlap) {
      const user = await this.updateUserService.update(params.id, dto);
      return user;
    }

    // TODO: PhoneAuthAccessSession에서 최근에 폰 인증이 되었는지 획인해야함.
  }

  @Post('is-exist')
  async isUserExists(
    @Body()
    body: any,
  ) {
    const existParams = plainToInstance(IsUserExistsDto, body);
    const errors = await validate(existParams);
    if (errors.length > 0) {
      throw new HttpException('Badly formatted request', 400);
    }

    const users = await this.prismaService.users.findMany({
      where: {
        Email: existParams.Email ?? undefined,
        PhoneNumber: existParams.PhoneNumber ?? undefined,
      },
    });

    const result = {
      exists: true,
    };

    if (users.length === 0) {
      result.exists = false;
    }

    return result;
  }

  @Get(':id/point-transactions')
  @UseGuards(UserAuthGuard)
  async transactions(
    @Param()
    params,
  ) {
    const point = await this.prismaService.pointTransactions.findFirst({
      where: {
        UserID: params.id,
      },
    });
    return point;
  }
}
