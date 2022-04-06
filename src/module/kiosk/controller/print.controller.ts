import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

// TODO: use guards
@Controller('print')
export class PrintController {
  // TODO: Add service
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':verifyNumber')
  async findOneWithVerifyNumber(
    @Param('verifyNumber')
    verifyNumber: string,
  ) {
    // this.prismaService.printJobs.findMany('')
  }

  @Post(':verifyNumber/complete')
  async complete(
    @Param('verifyNumber')
    verifyNumber: string,
  ) {
    // TODO: implement controller with service
  }
}
