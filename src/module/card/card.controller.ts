import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';

@Controller('users/:userId/cards')
export class CardController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':cardId')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const cards = await this.prismaService.cards.findMany({
      where: {
        UserID: userId,
      },
    });

    return cards;
  }
}
