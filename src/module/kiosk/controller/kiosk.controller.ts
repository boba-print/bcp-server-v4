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
import { KioskAuthRequest } from 'src/common/interface/AuthRequest';
import { PrismaService } from 'src/service/prisma.service';
import { IsAuthorizedWithKioskIdGuard } from '../guard/IsAuthorizedWithKioskId.guard';

// TODO: use guards
@Controller('kiosk')
export class KiosksController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  @UseGuards(IsAuthorizedWithKioskIdGuard)
  async findUnique(
    @Req()
    req: KioskAuthRequest,
  ) {
    // kiosk 객체는 `kiosk-auth.middleware.ts` 로 부터 옴
    return req.kiosk.toObj();
  }

  @Post(':id/supply-paper')
  @UseGuards(IsAuthorizedWithKioskIdGuard)
  async update(
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;
    kiosk.supplyPaper();

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kiosk.toObj().KioskID,
      },
      data: kiosk.toObj(),
    });
  }

  @Post(':id/heartbeat')
  @UseGuards(IsAuthorizedWithKioskIdGuard)
  async heartbeat(
    @Req()
    req: KioskAuthRequest,
  ) {
    const { kiosk } = req;
    kiosk.heartbeat();

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kiosk.toObj().KioskID,
      },
      data: kiosk.toObj(),
    });
  }
}
