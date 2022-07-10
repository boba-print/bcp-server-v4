import { HttpException, Injectable } from '@nestjs/common';
import { PrintJobs } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePrintJobDto } from '../dto/CreatePrintJob.dto';
import { v4 } from 'uuid';
import { PageFitting } from '../types/PageFitting';
import { LayoutOrder } from '../types/LayoutOrder';
import { Duplex } from '../types/Duplex';
import { NUp } from '../types/NUp';
import { PaperOrientation } from '../types/PaperOrientation';

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
    let verificationNumber = await this.getOverlapPassword(userId, kioskId);
    if (!verificationNumber) {
      verificationNumber = await this.generateRandomNumber();
    }
    //PageRanges 유효성 검사
    const isPageRangesValidate = await this.pageRangesValidator(pageRanges);
    if (!isPageRangesValidate) {
      throw new HttpException('Wrongly formated', 400);
    }

    //uuId 생성해야 함 내가 임의로 uuid 라이브러리 써도 되는지
    const now = new Date();
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 48);
    const printJob: PrintJobs = {
      PrintJobID: v4(),
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

  private async pageRangesValidator(pageRange: string) {
    const pageRanges = pageRange.split(',');
    for (const pageRange of pageRanges) {
      if (/^[0-9]+-[0-9]+$/.test(pageRange)) {
        const pages = pageRange.split('-');
        if (pages[0] > pages[1]) {
          return false;
        }
        continue;
      } else if (/^[0-9]+$/.test(pageRange)) {
        continue;
      } else {
        return false;
      }
    }
    let num: string[] = [];
    for (const pageRange of pageRanges) {
      const page = pageRange.split('-');
      if (page.length === 1) {
        num.push(page[0]);
      } else {
        num.push(page[0]);
        num.push(page[1]);
      }
    }
    let base = '0';
    for (const n of num) {
      if (base > n) {
        return false;
      }
      base = n;
    }

    return true;
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
      throw new HttpException('not found', 404);
    }
    if (!queryResult.FilesConverted) {
      throw new HttpException('not found', 404);
    }

    return queryResult.FilesConverted.NumPages;
  }

  private async generateRandomNumber() {
    const numbers = '0123456789';
    let verificationNumber = '';
    while (true) {
      verificationNumber = '';
      for (let i = 0; i < 5; i++) {
        verificationNumber += numbers.charAt(Math.floor(Math.random() * 10));
      }
      const queryResult = await this.prismaService.printJobs.findFirst({
        where: {
          VerificationNumber: verificationNumber,
        },
      });
      if (!queryResult) {
        break;
      }
    }
    return verificationNumber;
  }

  private async getOverlapPassword(userId: string, kioskId: string) {
    const printJob = await this.prismaService.printJobs.findFirst({
      where: {
        UserID: userId,
        KioskID: kioskId,
      },
    });
    if (!printJob) {
      return;
    }
    return printJob.VerificationNumber;
  }
}
