import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KioskAuthRequest } from 'src/common/interface/AuthRequest';
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
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;

    // 키오스크의 인증번호에 해당하는 printJob들과 해당하는 파일들을 가져온다.
    const printJobs = await this.prismaService.printJobs.findMany({
      where: {
        KioskID: kiosk.KioskID,
        VerificationNumber: verifyNumber,
        IsDeleted: 0,
      },
      include: {
        Files: {
          include: {
            FilesConverted: true,
          },
        },
        Users: true,
        Kiosks: true,
      },
    });
    return printJobs;
  }

  @Post(':verifyNumber/complete')
  async complete(
    @Param('verifyNumber')
    verifyNumber: string,
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;

    // 해당하는 printJob 을 쿼리한다.
    const printJobs = await this.prismaService.printJobs.findMany({
      select: {
        PrintJobID: true,
      },
      where: {
        KioskID: kiosk.KioskID,
        VerificationNumber: verifyNumber,
        IsDeleted: 0,
      },
    });
  }
}
