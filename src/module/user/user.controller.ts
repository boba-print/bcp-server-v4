import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/CreateUser.dto';
import { CreateUserService } from './service/create-user.service';

@Controller('users')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}
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
}
