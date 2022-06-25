import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Controller('public')
export class PublicController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post('user/exists')
  async isUserExists() {};
}
