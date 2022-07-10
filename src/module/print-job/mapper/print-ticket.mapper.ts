import { Injectable } from '@nestjs/common';
import { PrintJobs } from '@prisma/client';
import { Duplex } from '../types/Duplex';
import { LayoutOrder } from '../types/LayoutOrder';
import { NUp } from '../types/NUp';
import { PageFitting } from '../types/PageFitting';
import { PageRange } from '../types/PageRange';
import { PaperOrientation } from '../types/PaperOrientation';
import { PrintTicket } from '../types/PrintTicket';

@Injectable()
export class PrintTicketMapper {
  mapFromRelation(printJob: PrintJobs): PrintTicket {
    return {
      version: 'v2.0',
      layout: {
        order: LayoutOrder[printJob.LayoutOrder],
        nUp: this.nUpToEnum(printJob.NUp),
      },
      copies: printJob.NumCopies,
      duplex: Duplex[printJob.Duplex],
      fitToPage: PageFitting[printJob.PageFitting],
      isColor: !!printJob.IsColor,
      pageRanges: this.formatPageRanges(printJob.PageRanges),
      paperOrientation: PaperOrientation[printJob.PaperOrientation],
    };
  }

  private nUpToEnum(nUp: number) {
    switch (nUp) {
      case 1:
        return NUp.One;
      case 2:
        return NUp.Two;
      case 4:
        return NUp.Four;
      case 6:
        return NUp.Six;
      case 8:
        return NUp.Eight;
      case 9:
        return NUp.Nine;
      default:
        return NUp.One;
    }
  }

  private formatPageRanges(ranges: string): PageRange[] {
    return ranges.split(',').map(this.toRange);
  }

  private toRange(range: string): PageRange {
    if (/^[0-9]+-[0-9]+$/.test(range)) {
      const pages = range.split('-');
      return { start: Number(pages[0]), end: Number(pages[1]) };
    }
    return { start: Number(range), end: Number(range) };
  }
}
