import { Injectable } from '@nestjs/common';
import { Context } from 'src/domain/PointTransaction/Context.enum';
import { PointTransactionBuilder } from 'src/domain/PointTransaction/PointTransaction.builder';
import { PointTransactionEntity } from 'src/domain/PointTransaction/PointTransaction.entity';
import { UserEntity } from 'src/domain/User/User.entity';

@Injectable()
class PointPurchaseService {
  purchase(price: number, user: UserEntity) {
    if (price > user.props.Points) {
      // 유저의 포인트가 더 많으면 throw
      throw new Error('Not Enough Points');
    }
    user.props.Points = user.props.Points - price;

    const pointTransaction = new PointTransactionBuilder()
      .setContext(Context.Print)
      .setUserId(user.props.UserID)
      .setPointChanged(-price)
      .setRemainingPoint(user.props.Points)
      .build();
    return pointTransaction;
  }
}
export const pointPurchaseService = new PointPurchaseService();
