import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { PhoneAuthSessionService } from '../auth/service/phone-auth-session.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { IsUserExistsDto } from './dto/IsUserExists.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { PrintOrderService } from './service/print-order.service';
import { UserService } from './service/user.service';
import * as admin from 'firebase-admin';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly printOrderService: PrintOrderService,
    private readonly phoneAuthSessionService: PhoneAuthSessionService,
  ) {}

  @Post('create')
  async create(@Body() body: any) {
    const dto = plainToInstance(CreateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const isVerified = await this.phoneAuthSessionService.checkKey(
      dto.phoneAuthSessionKey,
    );
    if (!isVerified) {
      throw new HttpException('Not available phone auth session', 403);
    }

    // TODO: PhoneAuthSession 에서 최근에 휴대폰 인증이 되었는지 확인해야 함.
    const isEmailOverlap = await this.userService.isEmailOverlap(dto.email);
    const isPhoneOverlap = await this.userService.isPhoneOverlap(
      dto.phoneNumber,
    );
    if (isEmailOverlap || isPhoneOverlap) {
      throw new HttpException('User info conflict', 409);
    }

    const user = await this.userService.create(dto);
    return user;
  }

  @Get(':userId')
  @UseGuards(UserAuthGuard)
  async findUnique(
    @Param('userId')
    userId: string,
  ) {
    const user = await this.prismaService.users.findUnique({
      where: {
        UserID: userId,
      },
    });
    return user;
  }

  @Get(':userId/print-orders')
  @UseGuards(UserAuthGuard)
  async findUserPrintOrders(
    @Param('userId')
    userId: string,
    @Query('n')
    n: string,
  ) {
    let numLimit = parseInt(n);
    if (isNaN(numLimit)) {
      console.warn(
        '[UserController.findUserPrintOrders] parsing number error, set to default 10',
      );
      numLimit = 10;
    }

    const printOrders = await this.printOrderService.findMany(
      {
        UserID: userId,
      },
      0,
      numLimit,
    );

    return printOrders;
  }

  @Get(':userId/point-transactions')
  @UseGuards(UserAuthGuard)
  async findUserPointTranscations(
    @Param('userId')
    userId: string,
    @Query('n')
    n: string,
  ) {
    let numLimit = parseInt(n);
    if (isNaN(numLimit)) {
      console.warn(
        '[UserController.findUserPointTranscations] parsing number error, set to default 10',
      );
      numLimit = 10;
    }

    const queryResult = await this.prismaService.pointTransactions.findMany({
      where: {
        UserID: userId,
      },
      take: numLimit,
      orderBy: {
        CreatedAt: 'desc',
      },
    });
    return queryResult;
  }

  @Patch(':userId')
  @UseGuards(UserAuthGuard)
  async patch(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    // 모든 속성이 undefined 인 경우
    if (!dto.name && !dto.phoneNumber && !dto.phoneAuthSessionKey) {
      throw new HttpException('Badly formed', 400);
    }

    // 휴대폰 번호를 변경 요청할때 session key 가 없는경우. 그리고 반대의 경우
    if (
      (!dto.phoneNumber && dto.phoneAuthSessionKey) ||
      (dto.phoneNumber && !dto.phoneAuthSessionKey)
    ) {
      throw new HttpException('Badly formed', 400);
    }

    // phone auth session 이 유효한지 확인한다.
    if (dto.phoneNumber && dto.phoneAuthSessionKey) {
      const isVerified = await this.phoneAuthSessionService.checkKey(
        dto.phoneAuthSessionKey,
      );
      if (!isVerified) {
        throw new HttpException('Not available phone auth session', 403);
      }
    }

    const user = await this.userService.update(userId, dto);
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

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    const userRecord = await admin.auth().updateUser(userId, {
      disabled: true,
    });
    const { uid } = userRecord;
    const user = await this.prismaService.users.update({
      where: {
        UserID: uid,
      },
      data: {
        IsDeleted: 1,
      },
    });

    return user;
  }
}
