import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/common/guard/UserAuth.guard';
import { PrismaService } from 'src/service/prisma.service';

@Controller('users')
export class CardController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':userId/cards')
  @UseGuards(UserAuthGuard)
  async findMany(@Param('userId') userId: string, @Query('n') n: string) {
    let numLimit = parseInt(n);
    if (isNaN(numLimit)) {
      console.warn(
        '[CardController.findMany] parsing number error, set to default 10',
      );
      numLimit = 10;
    }

    const cards = await this.prismaService.cards.findMany({
      where: {
        UserID: userId,
      },
      take: numLimit,
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    return cards;
  }
}
