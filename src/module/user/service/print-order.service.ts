import { Injectable } from '@nestjs/common';
import { PrintOrders } from '@prisma/client';
import { PrintOrderEntity } from 'src/domain/PrintOrder/PrintOrder.entity';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PrintOrderService {
  private printOrderQueryInclude = {
    PrintOrder_PrintJob: {
      include: {
        PrintJobs: {
          include: {
            Files: {
              include: {
                FilesConverted: true,
              },
            },
          },
        },
      },
    },
    Kiosks: true,
    CardTransactions: true,
    PointTransactions: true,
  };

  constructor(private prismaService: PrismaService) {}

  async findMany(query: Partial<PrintOrders>, skip: number, take: number) {
    const relations = await this.prismaService.printOrders.findMany({
      where: query,
      skip,
      take,
      orderBy: {
        CreatedAt: 'desc',
      },
      include: this.printOrderQueryInclude,
    });
    return relations.map((rel) => new PrintOrderEntity(rel));
  }
}
