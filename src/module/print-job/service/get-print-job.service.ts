import { HttpException, Injectable } from '@nestjs/common';
import { Kiosks, PrintJobs } from '@prisma/client';
import {
  classToPlain,
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { PrismaService } from 'src/service/prisma.service';
import { PrintJobDto } from '../dto/PrintJob.dto';
import { Duplex } from '../types/Duplex';
import { LayoutOrder } from '../types/LayoutOrder';
import { NUp } from '../types/NUp';
import { PageFitting } from '../types/PageFitting';
import { PageRange } from '../types/PageRange';
import { PaperOrientation } from '../types/PaperOrientation';
import { PrintJobErrorType } from '../types/PrintJobErrorType';
import { PrintTicket } from '../types/PrintTicket';

@Injectable()
export class GetPrintJobService {
  constructor(private readonly prismaService: PrismaService) {}

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
        Files: {
          select: {
            FileID: true,
            CreatedAt: true,
            ModifiedAt: true,
            ViewName: true,
            Size: true,
            FileConvertedID: true,
            ErrorType: true,
          },
        },
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
      return {
        id: Files.FileID,
        createdAt: Files.CreatedAt,
        modifiedAt: Files.ModifiedAt,
        name: Files.ViewName,
        size: Files.Size,
        isConverted: Boolean(Files.FileConvertedID),
        errorType: Files.ErrorType as PrintJobErrorType,
      };
    });

    // 가격 계산
    const price = await this.calculatePrice(queryResults, Kiosks);
    // {start : '1', end : '2'} 형식으로 포멧
    const pageRanges = queryResults[0].PageRanges.split(',');
    const pageRange = pageRanges.map((pr) => this.printRangesFormer(pr));

    // PrintTicket으로 mapping

    const printTicket: PrintTicket = {
      version: 'v2.0',
      layout: {
        order: queryResults[0].LayoutOrder as LayoutOrder,
        nUp: queryResults[0].NUp,
      },
      copies: queryResults[0].NumCopies,
      duplex: queryResults[0].Duplex as Duplex,
      fitToPage: queryResults[0].PageFitting as PageFitting,
      isColor: Boolean(queryResults[0].IsColor),
      pageRanges: pageRange,
      paperOrientation: queryResults[0].PaperOrientation as PaperOrientation,
    };

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
      kiosk: {
        id: Kiosks.KioskID,
        name: Kiosks.Name,
        description: Kiosks.Description,
        color: Boolean(Kiosks.PriceA4Color),
        mono: Boolean(Kiosks.PriceA4Mono),
      },
      files,
    };

    return printJob;
  }

  private printRangesFormer(pR: string): PageRange {
    if (/^[0-9]+-[0-9]+$/.test(pR)) {
      const pages = pR.split('-');
      return { start: Number(pages[0]), end: Number(pages[1]) };
    }
    return { start: Number(pR), end: Number(pR) };
  }

  private async calculatePrice(printJob: any, kiosk: Kiosks) {
    if (printJob.IsColor) {
      return Number(printJob.NumPrintPages) * Number(kiosk.PriceA4Color);
    }
    return Number(printJob.NumPrintPages) * Number(kiosk.PriceA4Mono);
  }
}
