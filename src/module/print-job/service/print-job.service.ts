import { Injectable } from '@nestjs/common';
import { PrintJobs } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from '../dto/CreatePrintJob.dto';

@Injectable()
export class PrintJobService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreatePrintJobDto) {
    const {
      kioskId,
      userId,
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
