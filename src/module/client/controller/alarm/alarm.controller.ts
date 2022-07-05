import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { PrintOrderService } from 'src/module/client/service/print-order/print-order.service';
import { PrismaService } from 'src/service/prisma.service';
import { UserAuthRequest } from '../../../../common/interface/UserAuthRequest';
import { UserAuthGuard } from '../../../../common/guard/UserAuth.guard';
import { AlarmService } from '../../service/alarm.service';

@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @UseGuards(UserAuthGuard)
  @Get()
  async getRecent(
    @Req()
    req: UserAuthRequest,
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
    return this.alarmService.getAlarms(user, numLimit);
  }
}
