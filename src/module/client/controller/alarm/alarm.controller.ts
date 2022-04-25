import { Controller, Get, Query, Req } from '@nestjs/common';
import { PrintOrderService } from 'src/service/print-order/print-order.service';
import { ClientAuthRequest } from '../../ClientAuthRequest';

@Controller('alarm')
export class AlarmController {
  constructor(private readonly printOrderService: PrintOrderService) {}

  @Get()
  async getAll(
    @Req()
    req: ClientAuthRequest,
    @Query('n')
    numLimit: number,
  ) {
    // 현재는 프린트 내역만 알람으로 가져온다. 추후에 공지사항과 기타 알림 기능도 알람에 포함되어야 함.
    const { user } = req;
    const printOrders = await this.printOrderService.findMany(
      {
        UserID: user.UserID,
      },
      0,
      numLimit,
    );
    return printOrders.map((po) => po.props);
  }
}
