import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { KioskDto } from '../dto/kiosk.dto';

// TODO: use guards
@Controller()
export class KiosksController {
  // TODO: Add service
  constructor() {
    console.log(`Constructed`);
  }

  @Get(':id')
  async findUnique(
    @Param('id')
    id: string,
  ) {
    // TODO: implement controller with service
  }

  @Put()
  async update(@Body() kioskDto: KioskDto) {
    // TODO: implement controller with service
  }

  @Post('heartbeat/:id')
  async heartbeat(
    @Param('id')
    id: string,
  ) {
    // TODO: implement controller with service
  }
}
