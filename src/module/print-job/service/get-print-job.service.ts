import { HttpException, Injectable } from '@nestjs/common';
import { Kiosks, PrintJobs } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { PrintJobDto } from '../dto/PrintJob.dto';
import { FileMapper } from '../mapper/file.mapper';
import { KioskMapper } from '../mapper/kiosk.mapper';
import { PrintTicketMapper } from '../mapper/print-ticket.mapper';

@Injectable()
export class GetPrintJobService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly printTicketMapper: PrintTicketMapper,
    private readonly filesMapper: FileMapper,
    private readonly kioskMapper: KioskMapper,
  ) {}

  // 해당 printjob이 해당 user의 것인지 판단, kiosks 가져오기
  async findOne(userId: string, printJobId: string) {
    //해당 유저의 printJobs 중에 처리가 안된 printJob들의 file들
    const queryResults = await this.prismaService.printJobs.findMany({
      where: {
        UserID: userId,
        PrintJobID: printJobId,
        IsDeleted: 0,
      },
      include: {
        Kiosks: true,
        Files: true,
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });
    if (!queryResults) {
      throw new HttpException('printJob info conflict', 409);
    }
    const { Kiosks } = queryResults[0];

    // files의 file을 printJobDto에 요구된 형태로 포멧
    const files = queryResults.map(({ Files }) => {
      return this.filesMapper.mapFromRelation(Files);
    });

    // 가격 계산
    const price = await this.calculatePrice(queryResults, Kiosks);

    // PrintTicket으로 mapping
    const printTicket = this.printTicketMapper.mapFromRelation(queryResults[0]);
    const kiosk = this.kioskMapper.mapFromRelation(Kiosks);

    // PrintJobDto에 따라 mapping
    const printJob: PrintJobDto = {
      id: queryResults[0].PrintJobID,
      createdAt: queryResults[0].CreatedAt,
      modifiedAt: queryResults[0].ModifiedAt,
      expireAt: queryResults[0].ExpireAt,
      userId: queryResults[0].UserID,
      numPrintPages: queryResults[0].NumPrintPages,
      verificationNumber: queryResults[0].VerificationNumber,
      ticket: printTicket,
      price,
      kiosk,
      files,
    };

    return printJob;
  }

  private async calculatePrice(printJob: any, kiosk: Kiosks) {
    if (printJob.IsColor) {
      return Number(printJob.NumPrintPages) * Number(kiosk.PriceA4Color);
    }
    return Number(printJob.NumPrintPages) * Number(kiosk.PriceA4Mono);
  }
}
