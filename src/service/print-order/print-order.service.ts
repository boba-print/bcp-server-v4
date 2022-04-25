import { Injectable } from '@nestjs/common';
import { PrintOrders } from '@prisma/client';
import { NotFoundError } from 'src/common/error';
import { PrismaService } from '../prisma.service';
import { PrintOrderEntity } from '../../domain/PrintOrder/PrintOrder.entity';

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

  async findUnique(id: string) {
    const relation = await this.prismaService.printOrders.findUnique({
      where: {
        PrintOrderID: id,
      },
      include: this.printOrderQueryInclude,
    });
    if (!relation) {
      throw new NotFoundError('PrintOrder Not Found');
    }
    return new PrintOrderEntity(relation);
  }

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
