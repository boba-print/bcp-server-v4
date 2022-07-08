import { HttpException, Injectable } from '@nestjs/common';
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

  async findOne(params: any) {
    const queryResult = await this.prismaService.printJobs.findFirst({
      where: {
        UserID: params.userId,
        PrintJobID: params.printJobId,
      },
      include: {
        Kiosks: true,
      },
    });
    if (!queryResult) {
      throw new HttpException('Print Job info conflict', 409);
    }
    const queryResults = await this.prismaService.printJobs.findMany({
      where: {
        UserID: params.userId,
        IsDeleted: 0,
      },
      include: {
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
    });

    const { Kiosks } = queryResult;
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

    const price = await this.priceCalculator(queryResult, Kiosks);
    const pageRanges = queryResult.PageRanges.split(',');
    const pageRange = pageRanges.map((pr) => this.pRFormer(pr));

    const printTicket: PrintTicket = {
      version: 'v2.0',
      layout: {
        order: queryResult.LayoutOrder as LayoutOrder,
        nUp: queryResult.NUp as NUp,
      },
      copies: queryResult.NumCopies,
      duplex: queryResult.Duplex as Duplex,
      fitToPage: queryResult.PageFitting as PageFitting,
      isColor: Boolean(queryResult.IsColor),
      pageRanges: pageRange,
      paperOrientation: queryResult.PaperOrientation as PaperOrientation,
    };

    const printJob: PrintJobDto = {
      id: queryResult.PrintJobID,
      createdAt: queryResult.CreatedAt,
      modifiedAt: queryResult.ModifiedAt,
      expireAt: queryResult.ExpireAt,
      userId: queryResult.UserID,
      numPrintPages: queryResult.NumPrintPages,
      verificationNumber: queryResult.VerificationNumber,
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

  private pRFormer(pR: string): PageRange {
    if (/^[0-9]+-[0-9]+$/.test(pR)) {
      const pages = pR.split('-');
      return { start: Number(pages[0]), end: Number(pages[1]) };
    }
    return { start: Number(pR), end: Number(pR) };
  }

  private async priceCalculator(printJob: any, kiosk: any) {
    if (printJob.IsColor) {
      return Number(printJob.NumPrintPages) * Number(kiosk.PriceA4Color);
    }
    return Number(printJob.NumPrintPages) * Number(kiosk.PriceA4Mono);
  }
}
