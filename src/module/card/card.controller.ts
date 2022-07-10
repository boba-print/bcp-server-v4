import { callErrorFromStatus } from '@grpc/grpc-js/build/src/call';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { CardCreateDto } from './dto/CardCreate.dto';
import { CreateCardDto } from './dto/CreateCard.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardService } from './service/card.service';
import { IamportService } from './service/iamport.service';

@Controller('users/:userId/cards')
export class CardController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cardService: CardService,
    private readonly iamportService: IamportService,
  ) {}

  @Get()
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const cards = await this.prismaService.cards.findMany({
      where: {
        UserID: userId,
      },
    });

    return cards;
  }

  @Post('create')
  @UseGuards(UserAuthGuard)
  async create(@Param('userId') userId: string, @Body() body: any) {
    const dto = plainToInstance(CreateCardDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    try {
      return await this.cardService.create(userId, dto);
    } catch (err) {
      throw new HttpException('Iamport server error: ' + err.message, err);
    }
  }

  @Delete(':cardId')
  @UseGuards(UserAuthGuard)
  async remove(
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ) {
    return await this.cardService.remove(userId, cardId);
  }

  @Patch(':cardId')
  @UseGuards(UserAuthGuard)
  async patch(@Param() params: any, @Body() body: any) {
    const dto = plainToInstance(UpdateCardDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors[0].toString(), 400);
    }

    const result = await this.prismaService.cards.findFirst({
      where: {
        CardID: params.cardId,
        UserID: params.userId,
      },
    });
    if (!result) {
      throw new HttpException('Card info conflict', 409);
    }

    const card = await this.prismaService.cards.update({
      where: {
        CardID: params.cardId,
      },
      data: {
        RejectionMessage: dto.rejectionMessage,
      },
    });
    if (!card) {
      throw new HttpException('Card info conflict', 404);
    }

    return card;
  }

  @Post(':cardId/set-priority')
  @UseGuards(UserAuthGuard)
  async update(@Param() params: any) {
    const result = await this.prismaService.cards.findFirst({
      where: {
        CardID: params.cardId,
        UserID: params.userId,
      },
    });
    if (!result) {
      throw new HttpException('Card info conflict', 409);
    }

    const card = await this.prismaService.cards.update({
      where: {
        CardID: params.cardId,
      },
      data: {
        Priority: 1,
      },
    });
    if (!card) {
      throw new NotFoundException('Card Not Found!!');
    }

    const cards = await this.prismaService.cards.updateMany({
      where: {
        UserID: params.userId,
        Priority: 0,
      },
      data: {
        Priority: 1,
      },
    });
    if (!cards) {
      throw new NotFoundException('Cards Not Found!!');
    }

    return card;
  }
}
