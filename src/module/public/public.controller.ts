import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from 'src/service/prisma.service';
import { UserExistCheckDto } from './dto/UserExistsCheck.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('user/exists')
  async isUserExists(
    @Body()
    body: any,
  ) {
    const existParams = plainToClass(UserExistCheckDto, body);

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
