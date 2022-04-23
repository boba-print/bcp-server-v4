import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [],
  providers: [PrismaService],
})
export class ClientModule {}
