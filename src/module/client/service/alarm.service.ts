import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { AlarmEntity } from 'src/domain/Alarm/Alarm.entity';
import { PrintOrderService } from 'src/module/client/service/print-order/print-order.service';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class AlarmService {
  constructor(
    private readonly printOrderService: PrintOrderService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAlarms(user: Users, numLimit: number) {
    const { UserID } = user;

    // TODO: 현재는 프린트 내역만 알람으로 가져온다. 추후에 공지사항과 기타 알림 기능도 알람에 포함되어야 함.
    const printOrders = await this.printOrderService.findMany(
      {
        UserID: user.UserID,
      },
      0,
      numLimit,
    );

    const lastNoticeCheck = user.CheckedNoticeAt ?? new Date(0);

    // alarm 형태로 바꾼다.
    const alarms = printOrders.map(
      (po) => new AlarmEntity(po, lastNoticeCheck),
    );

    // 유저가 마지막으로 공지를 읽은 시간을 기록한다.
    await this.prismaService.users.update({
      where: { UserID },
      data: {
        CheckedNoticeAt: new Date(),
      },
    });
    return alarms;
  }
}
