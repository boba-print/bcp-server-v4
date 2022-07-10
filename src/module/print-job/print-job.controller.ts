import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from './dto/CreatePrintJob.dto';
import { PrintJobDto } from './dto/PrintJob.dto';
import { RegexValidator } from './regex.validator';
import { CreatePrintJobService } from './service/create-print-job.service';
import { GetPrintJobService } from './service/get-print-job.service';

@Controller('users/:userId')
export class PrintJobController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly createPrintJobService: CreatePrintJobService,
    private readonly getPrintJobService: GetPrintJobService,
    private readonly validateRegex: RegexValidator,
  ) {}

  @Get('print-jobs')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const printJobs = await this.prismaService.printJobs.findMany({
      where: {
        UserID: userId,
      },
    });

    return printJobs;
  }

  @Get('print-jobs/:printJobId')
  @UseGuards(UserAuthGuard)
  async findOne(@Param() params) {
    const result = await this.prismaService.printJobs.findFirst({
      where: {
        UserID: params.userId,
        PrintJobID: params.printJobId,
      },
    });
    if (!result) {
      throw new HttpException('PrintZone info conflict', 409);
    }

    const printJob: PrintJobDto = await this.getPrintJobService.findOne(
      params.userId,
    );

    return printJob;
  }

  @Post('print-jobs/create')
  @UseGuards(UserAuthGuard)
  async create(@Param('userId') userId, @Body() body: any) {
    const dto = plainToInstance(CreatePrintJobDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const result = await this.validateRegex.validatePageRange(dto.pageRanges);
    if (!result) {
      throw new HttpException('Badly formed', 400);
    }

    // 해당 파일이 해당 유저의 파일인지 판별
    const file = await this.prismaService.files.findFirst({
      where: {
        UserID: userId,
        FileID: dto.fileId,
      },
    });
    if (!file) {
      throw new HttpException('printJob info conflict', 409);
    }

    const printJob = await this.createPrintJobService.create(userId, dto);
    return printJob;
  }

  @Delete('print-jobs/:printJobId')
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
