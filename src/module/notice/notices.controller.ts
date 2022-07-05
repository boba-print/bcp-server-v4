import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Controller('notices')
export class NoticesController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  async findAll() {
    const notices = await this.prismaService.notices.findMany();
    return notices;
  }
}
