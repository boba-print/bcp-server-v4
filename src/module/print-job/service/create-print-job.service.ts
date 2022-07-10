import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrintJobs } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from '../dto/CreatePrintJob.dto';
import { v4 as uuidV4 } from 'uuid';
import { NotFoundError } from 'src/common/error';

@Injectable()
export class CreatePrintJobService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, dto: CreatePrintJobDto) {
    const {
      kioskId,
      fileId,
      numCopies,
      pageFitting,
      duplex,
      nUp,
      layoutOrder,
      paperOrientation,
      isColor,
      pageRanges,
    } = dto;

    // numpages 받아오기 fileId로
    const numPrintPages = await this.getNumPage(fileId);

    // random 5자리 숫자 문자열 생성
    let verificationNumber = await this.getOverlapVerificationNumber(
      userId,
      kioskId,
    );
    if (!verificationNumber) {
      verificationNumber = Math.floor(Math.random() * 90000 + 10000).toString();
    }

    //uuId 생성해야 함 내가 임의로 uuid 라이브러리 써도 되는지
    const now = new Date();
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 48);
    const printJob: PrintJobs = {
      PrintJobID: uuidV4(),
      CreatedAt: now,
      ModifiedAt: now,
      ExpireAt: expireAt,
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

    const PrintJob = await this.prismaService.printJobs.create({
      data: printJob,
    });

    return PrintJob;
  }

  private async getNumPage(fileId: string) {
    const queryResult = await this.prismaService.files.findUnique({
      where: {
        FileID: fileId,
      },
      select: {
        FilesConverted: {
          select: {
            NumPages: true,
          },
        },
      },
    });

    if (!queryResult) {
      throw new NotFoundError('not found!!');
    }
    if (!queryResult.FilesConverted) {
      throw new NotFoundError('not found!!');
    }

    return queryResult.FilesConverted.NumPages;
  }

  private async getOverlapVerificationNumber(userId: string, kioskId: string) {
    const printJob = await this.prismaService.printJobs.findFirst({
      where: {
        UserID: userId,
        KioskID: kioskId,
        IsDeleted: 0,
      },
    });
    if (!printJob) {
      return;
    }
    return printJob.VerificationNumber;
  }
}
