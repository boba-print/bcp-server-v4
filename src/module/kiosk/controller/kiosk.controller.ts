import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KioskEntity } from 'src/domain/kiosk.entity';
import { PrismaService } from 'src/service/prisma.service';

// TODO: use guards
@Controller('kiosk')
export class KiosksController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  async findUnique(
    @Param('id')
    id: string,
  ) {
    return this.prismaService.kiosks.findUnique({
      where: {
        KioskID: id,
      },
    });
  }

  @Post(':id/supply-paper')
  async update(
    @Param('id')
    id: string,
  ) {
    const rel = await this.prismaService.kiosks.findUnique({
      where: {
        KioskID: id,
      },
    });
    const kiosk = new KioskEntity(rel);
    kiosk.supplyPaper();

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kiosk.toObj().KioskID,
      },
      data: kiosk.toObj(),
    });
  }

  @Post(':id/heartbeat')
  async heartbeat(
    @Param('id')
    id: string,
  ) {
    const rel = await this.prismaService.kiosks.findUnique({
      where: {
        KioskID: id,
      },
    });
    const kiosk = new KioskEntity(rel);
    kiosk.heartbeat();

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kiosk.toObj().KioskID,
      },
      data: kiosk.toObj(),
    });
  }
}
