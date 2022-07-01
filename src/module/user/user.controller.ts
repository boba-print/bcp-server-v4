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
import { UserUpdateDto } from './dto/UserUpdate.dto';
import { CreateUserService } from './service/create-user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
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
    const dto = plainToInstance(UserUpdateDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    // TODO: PhoneAuthSession 에서 최근에 휴대폰 인증이 되었는지 확인해야 함.

    const { name, isDeleted, phoneNumber } = dto;
    //1. Firebase 에 계정을 추가한다.
    const userRecord = await admin.auth().updateUser(params.id, {
      disabled: Boolean(isDeleted),
      phoneNumber,
    });

    //2. MySQL 에 추가한다.
    const { uid } = userRecord;
    const user = await this.prismaService.users.update({
      where: {
        UserID: uid,
      },
      data: {
        Name: name,
        IsDeleted: isDeleted,
        PhoneNumber: phoneNumber,
      },
    });

    return user;
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
