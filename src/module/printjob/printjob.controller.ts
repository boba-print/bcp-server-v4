import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';

@Controller('users')
export class PrintJobController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id/print-jobs')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('id') id: string, @Query('n') n: string) {
    let numLimit: number;
    numLimit = parseInt(n);
    if (isNaN(numLimit)) {
      console.warn(
        '[UserController.findUserPrintJobs] parsing number error, set to default 10',
      );
      numLimit = 10;
    }
    const printJobs = await this.prismaService.printJobs.findMany({
      where: {
        UserID: id,
      },
      take: numLimit,
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
    return printJob;
  }
}
