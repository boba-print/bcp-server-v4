import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KioskModule } from './module/kiosk/kiosk.module';

@Module({
  imports: [KioskModule],
})
export class AppModule {}
