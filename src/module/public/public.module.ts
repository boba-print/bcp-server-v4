import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController],
  providers: [PrismaService],
})
export class PublicModule {}
