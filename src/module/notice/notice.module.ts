import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { NoticesController } from './notices.controller';

@Module({
  controllers: [NoticesController],
  providers: [PrismaService],
})
export class NoticesModule {}
