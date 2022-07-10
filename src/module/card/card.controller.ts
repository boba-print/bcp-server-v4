import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NotFoundError } from 'src/common/error';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('users/:userId')
export class CardController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('cards')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const cards = await this.prismaService.cards.findMany({
      where: {
        UserID: userId,
      },
    });

    return cards;
  }

  @Patch('cards/:cardId')
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
      throw new NotFoundError('Card Not Found!!');
    }

    return card;
  }

  @Post('cards/:cardId/set-priority')
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
      throw new NotFoundError('Card Not Found!!');
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
      throw new NotFoundError('Cards Not Found!!');
    }

    return card;
  }
}
