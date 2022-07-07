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
export class PrintJobService {
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
    const verificationNumber = await this.randomNumGenerator();

    //PageRanges 유효성 검사
    const isPageRangesValidate = await this.pageRangesValidator(pageRanges);
    if (!isPageRangesValidate) {
      throw new HttpException('Wrongly formated', 400);
    }

    //Enum으로 유효성 검사
    const isValidateByEnum = await this.validatorWithEnum({
      pageFitting,
      duplex,
      nUp,
      layoutOrder,
      paperOrientation,
    });
    if (!isValidateByEnum) {
      throw new HttpException('Wrongly formated', 400);
    }
    //uuId 생성해야 함 내가 임의로 uuid 라이브러리 써도 되는지
    const now = new Date();
    const printJob: PrintJobs = {
      PrintJobID: v4(),
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

    const PrintJob = await this.prismaService.printJobs.create({
      data: printJob,
    });

    return PrintJob;
  }

  private async validatorWithEnum(props: any) {
    const { pageFitting, layoutOrder, duplex, nUp, paperOrientation } = props;
    const pageFittings = Object.values(PageFitting);
    const layoutOrders = Object.values(LayoutOrder);
    const duplexs = Object.values(Duplex);
    const nUps = Object.values(NUp);
    const paperOrientations = Object.values(PaperOrientation);
    let count = 0;
    for (const value of pageFittings) {
      if (value === pageFitting) {
        count++;
      }
    }
    for (const value of layoutOrders) {
      if (value === layoutOrder) {
        count++;
      }
    }

    for (const value of duplexs) {
      if (value === duplex) {
        count++;
      }
    }

    for (const value of nUps) {
      if (value === nUp) {
        count++;
      }
    }
    for (const value of paperOrientations) {
      if (value === paperOrientation) {
        count++;
      }
    }
    if (count !== 5) {
      return false;
    }
    return true;
  }

  private async pageRangesValidator(pageRanges: string) {
    if (/^[0-9]+-[0-9]+$/.test(pageRanges)) {
      const pages = pageRanges.split('-');
      if (pages[0] > pages[1]) {
        return false;
      }
      return true;
    }

    if (/^[0-9]+$/.test(pageRanges)) {
      return true;
    }

    return false;
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

  private async randomNumGenerator() {
    const numbers = '0123456789';
    let verificationNumber = '';
    for (let i = 0; i < 5; i++) {
      verificationNumber += numbers.charAt(Math.floor(Math.random() * 10));
    }
    return verificationNumber;
  }
}
