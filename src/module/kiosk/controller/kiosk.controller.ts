import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { KioskAuthRequest } from 'src/common/interface/KioskAuthRequest';
import { PrismaService } from 'src/service/prisma.service';
import { KioskAuthGuard } from '../../../common/guard/KioskAuth.guard';

// TODO: use guards
@Controller('kiosk')
export class KiosksController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  @UseGuards(KioskAuthGuard)
  async findUnique(
    @Req()
    req: KioskAuthRequest,
  ) {
    // kiosk 객체는 `kiosk-auth.middleware.ts` 로 부터 옴
    return req.kiosk;
  }

  @Post(':id/supply-paper')
  @UseGuards(KioskAuthGuard)
  async update(
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;
    // 용지 채우기
    kiosk.NumRemainPaper = kiosk.PaperTrayCapacity;

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kiosk.KioskID,
      },
      data: kiosk,
    });
  }

  @Post(':id/heartbeat')
  @UseGuards(KioskAuthGuard)
  async heartbeat(
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;
    // 현재 시각을 마지막 연결 시각으로 설정
    kiosk.LastConnectedAt = new Date();

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kiosk.KioskID,
      },
      data: kiosk,
    });
  }
}
