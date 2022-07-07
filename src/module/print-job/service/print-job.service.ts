import { Injectable } from '@nestjs/common';
import { PrintJobs } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from '../dto/CreatePrintJob.dto';

@Injectable()
export class PrintJobService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, dto: CreatePrintJobDto) {
    const {
      kioskId,
      fileId,
      numPrintPages,
      verificationNumber,
      numCopies,
      pageFitting,
      duplex,
      nUp,
      layoutOrder,
      paperOrientation,
      isColor,
      pageRanges,
    } = dto;
    //uuId 생성해야 함 내가 임의로 uuid 라이브러리 써도 되는지
    const now = new Date();
    const printJob: PrintJobs = {
      PrintJobID: 'abc',
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 0,
      KioskID: kioskId,
      UserID: userId,
      FileID: fileId,
      NumPrintPages: numPrintPages,
      VerificationNumber: verificationNumber,
      NumCopies: numCopies,
      PageFitting: pageFitting,
      Duplex: duplex,
      NUp: nUp,
      LayoutOrder: layoutOrder,
      PaperOrientation: paperOrientation,
      IsColor: isColor,
      PageRanges: pageRanges,
    };

    const queryResult = await this.prismaService.printJobs.create({
      data: printJob,
    });

    return queryResult;
  }
}
