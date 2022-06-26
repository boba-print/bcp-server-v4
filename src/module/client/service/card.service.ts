import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class CardService {
  constructor(private readonly prismaService: PrismaService) {}
}
