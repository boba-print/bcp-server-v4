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
    const printJobs = await this.prismaService.printJobs.findMany({
      where: {
        KioskID: kiosk.toObj().KioskID,
        VerificationNumber: verifyNumber,
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
  }

  @Post(':verifyNumber/complete')
  async complete(
    @Param('verifyNumber')
    verifyNumber: string,
  ) {
    // TODO: implement controller with service
  }
}
