import { Injectable } from '@nestjs/common';
import { PrintJobs } from '@prisma/client';
import * as admin from 'firebase-admin';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from '../dto/CreatePrintJob.dto';

@Injectable()
export class PrintJobService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreatePrintJobDto) {
    const {
      kioskID,
      userID,
      fileID,
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

    //TODO: 1.Firebase에 printJob을 추가해야함.
    const now = new Date();
    const printJob: PrintJobs = {
      PrintJobID: 'abc',
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 0,
      KioskID: kioskID,
      UserID: userID,
      FileID: fileID,
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

    await this.prismaService.printJobs.create({
      data: printJob,
    });
  }
}
