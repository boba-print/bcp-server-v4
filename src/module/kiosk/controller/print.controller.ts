import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

// TODO: use guards
@Controller('print')
export class PrintController {
  // TODO: Add service
  constructor() {
    console.log('Constructed');
  }

  @Get(':verifyNumber')
  async findOneWithVerifyNumber(
    @Param('verifyNumber')
    verifyNumber: string,
  ) {
    // TODO: implement controller with service
  }

  @Post(':verifyNumber/complete')
  async complete(
    @Param('verifyNumber')
    verifyNumber: string,
  ) {
    // TODO: implement controller with service
  }
}
