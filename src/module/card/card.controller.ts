import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';

@Controller('users')
export class CardController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':userId/cards')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string) {
    const cards = await this.prismaService.cards.findMany({
      where: {
        UserID: userId,
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    return cards;
  }
}
