import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { PrintOrderService } from 'src/module/client/service/print-order/print-order.service';
import { PrismaService } from 'src/service/prisma.service';
import { ClientAuthRequest } from '../../ClientAuthRequest';
import { IsAuthorizedWithClientIdGuard } from '../../guard/IsAuthorizedWithClientId.guard';

@Controller('alarm')
export class AlarmController {
  constructor(
    private readonly printOrderService: PrintOrderService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  async getRecent(
    @Req()
    req: ClientAuthRequest,
    @Query('n')
    n: string,
  ) {
    // TODO: 현재는 프린트 내역만 알람으로 가져온다. 추후에 공지사항과 기타 알림 기능도 알람에 포함되어야 함.
    const { user } = req;

    let numLimit: number;
    try {
      numLimit = parseInt(n);
    } catch (err) {
      console.warn(
        '[AlarmController.getRecent] parsing number error, set to default 10',
      );
      numLimit = 10;
    }
    const printOrders = await this.printOrderService.findMany(
      {
        UserID: user.UserID,
      },
      0,
      numLimit,
    );

    // 유저가 마지막으로 공지를 읽은 시간을 기록한다.
    await this.prismaService.users.update({
      where: { UserID: req.user.UserID },
      data: {
        CheckedNoticeAt: new Date(),
      },
    });
    return printOrders.map((po) => po.props);
  }
}
