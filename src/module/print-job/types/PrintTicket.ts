import { Duplex } from './Duplex';
import { LayoutOrder } from './LayoutOrder';
import { NUp } from './NUp';
import { PageFitting } from './PageFitting';
import { PageRange } from './PageRange';
import { PaperOrientation } from './PaperOrientation';

export interface PrintTicket {
  version: 'v2.0';
  layout: {
    order: LayoutOrder;
    nUp: NUp;
  };
  copies: number;
  duplex: Duplex;
  fitToPage: PageFitting;
  isColor: boolean;
  pageRanges: PageRange[];
  paperOrientation: PaperOrientation;
}
