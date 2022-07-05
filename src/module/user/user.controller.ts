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
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { PhoneAuthSessionService } from '../auth/service/phone-auth-session.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { IsUserExistsDto } from './dto/IsUserExists.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserService } from './service/user.service';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
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
      throw new HttpException('User info conflict', 409);
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

  @Get(':id')
  @UseGuards(UserAuthGuard)
  async findUnique(
    @Param('id')
    id: string,
  ) {
    const user = await this.prismaService.users.findUnique({
      where: {
        UserID: id,
      },
    });
    return user;
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  async patch(@Param('id') id: string, @Body() body: any) {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const isPhoneOverlap = await this.userService.isPhoneOverlap(
      dto.phoneNumber,
    );
    if (!isPhoneOverlap) {
      const isVerified = await this.phoneAuthSessionService.checkKey(
        dto.phoneAuthSessionKey as string,
      );
      console.log(isVerified);
      if (!isVerified) {
        throw new HttpException('User info conflict', 409);
      }
    }
    const user = await this.userService.update(id, dto);
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
}
