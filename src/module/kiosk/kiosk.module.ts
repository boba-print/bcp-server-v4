import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { KiosksController } from './controller/kiosk.controller';
@Module({
  controllers: [KiosksController],
  providers: [PrismaService],
})
export class KioskModule {}
