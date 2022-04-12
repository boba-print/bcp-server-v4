import { FileProps } from '../File/File.entity';
import { KioskProps } from '../Kiosk/Kiosk.entity';

interface PrintJobProps {
  PrintJobID: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  IsDeleted: number;
  KioskID: string;
  UserID: string;
  FileID: string;
  NumPrintPages: number | null;
  VerificationNumber: string;
  NumCopies: number;
  PageFitting: string;
  Duplex: string;
  NUp: number;
  LayoutOrder: string;
  PaperOrientation: string;
  IsColor: number;
  PageRanges: string;
  Files: FileProps;
  Kiosks: KioskProps;
}

export class PrintJobEntity {
  props: PrintJobProps;
  constructor(props: PrintJobProps) {
    this.props = props;
  }
}
