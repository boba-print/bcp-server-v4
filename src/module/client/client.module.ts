import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/service/prisma.service';
import { ClientAuthMiddleWare } from './client-auth.middleware';
import { IsAuthorizedWithClientIdGuard } from './guard/IsAuthorizedWithClientId.guard';

@Module({
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: IsAuthorizedWithClientIdGuard,
    },
  ],
})
export class ClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientAuthMiddleWare).forRoutes();
  }
}
