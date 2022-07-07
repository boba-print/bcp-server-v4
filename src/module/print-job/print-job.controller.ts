import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from './dto/CreatePrintJob.dto';
import { PrintJobService } from './service/print-job.service';

@Controller('users')
export class PrintJobController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly printJobService: PrintJobService,
  ) {}

  @Get(':userId/print-jobs')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const printJobs = await this.prismaService.printJobs.findMany({
      where: {
        UserID: userId,
      },
    });

    return printJobs;
  }

  @Get(':userId/print-jobs/:printJobId')
  @UseGuards(UserAuthGuard)
  async findOne(@Param() params) {
    const printJob = await this.prismaService.printJobs.findFirst({
      where: {
        UserID: params.userId,
        PrintJobID: params.printJobId,
      },
    });

    if (!printJob) {
      throw new HttpException('printJob info conflict', 409);
    }

    return printJob;
  }

  @Post(':userId/print-jobs/create')
  @UseGuards(UserAuthGuard)
  async create(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(CreatePrintJobDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    //const printJob = await this.printJobService.create(userId, dto);
    //return printJob;
  }

  @Delete(':userId/print-jobs/:printJobId')
  @UseGuards(UserAuthGuard)
  async remove(@Param() params) {
    const result = await this.prismaService.printJobs.findFirst({
      where: {
        FileID: params.fileId,
        UserID: params.userId,
      },
    });

    if (!result) {
      throw new HttpException('printJob info conflict', 409);
    }

    const printJob = await this.prismaService.printJobs.update({
      where: {
        PrintJobID: params.printJobId,
      },
      data: {
        IsDeleted: 1,
      },
    });
    return printJob;
  }
}
