import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserAuthMiddleWare } from 'src/common/middleware/user-auth.middleware';
import { PrismaService } from 'src/service/prisma.service';
import { CardController } from './card.controller';
import { CardService } from './service/card.service';
import { IamportService } from './service/iamport.service';

@Module({
  controllers: [CardController],
  providers: [PrismaService, IamportService, CardService],
})
export class CardModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleWare).forRoutes(CardController);
  }
}
