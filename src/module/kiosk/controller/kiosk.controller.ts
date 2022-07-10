import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { KioskAuthRequest } from 'src/common/interface/KioskAuthRequest';
import { PrismaService } from 'src/service/prisma.service';
import { KioskAuthGuard } from '../../../common/guard/KioskAuth.guard';
import { KioskHeartBeatDto } from '../dto/KioskHeartBeat.dto';
import { KioskPasscodeVerifyResultDto } from '../dto/KioskPasscodeVerifyResult.dto';
import { PasscodeVerifyDto } from '../dto/PasscodeVerify.dto';
import { KioskCoordsDto } from '../dto/KioskCoords.dto';

// TODO: use guards
@Controller('kiosks')
export class KiosksController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('')
  async findAll() {
    const kiosks = await this.prismaService.kiosks.findMany();
    return kiosks;
  }

  @Get('coords')
  async findAllCoords() {
    const kiosks = await this.prismaService.kiosks.findMany({
      select: {
        Name: true,
        Latitude: true,
        Longitude: true,
        PriceA4Color: true,
        PriceA4Mono: true,
      },
    });
    console.log(kiosks);

    const dtos = kiosks.map((k) => plainToClass(KioskCoordsDto, k));
    console.log(dtos);
    return dtos;
  }

  @Get(':kioskId')
  async findUnique(
    @Param('kioskId')
    kioskId: string,
  ) {
    const kiosk = await this.prismaService.kiosks.findUnique({
      where: {
        KioskID: kioskId,
      },
    });
    return kiosk;
  }

  @Post(':kioskId/supply-paper')
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

  @Post(':kioskId/heartbeat')
  @UseGuards(KioskAuthGuard)
  async heartbeat(
    @Param('kioskId')
    kioskId: string,
    @Body()
    body: KioskHeartBeatDto,
  ) {
    const dto = plainToClass(KioskHeartBeatDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    return this.prismaService.kiosks.update({
      where: {
        KioskID: kioskId,
      },
      data: {
        LastConnectedAt: new Date(),
        CurrentViewPage: body.currentPage,
      },
    });
  }

  @Post(':kioskId/passcode/verify')
  @UseGuards(KioskAuthGuard)
  async verifyPasscode(
    @Param('kioskId')
    kioskId: string,
    @Body()
    body: PasscodeVerifyDto,
  ) {
    const dto = plainToClass(PasscodeVerifyDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const queryResult = await this.prismaService.kiosks.findUnique({
      select: {
        MaintenancePasscode: true,
      },
      where: {
        KioskID: kioskId,
      },
    });
    if (!queryResult) {
      throw new HttpException('Corresponding kiosk not found', 404);
    }

    const response: KioskPasscodeVerifyResultDto = {
      isSuccess: false,
    };
    if (queryResult.MaintenancePasscode === dto.passcode) {
      response.isSuccess = true;
    }
    return response;
  }
}
