import { PrintJobErrorType } from '../types/PrintJobErrorType';
import { PrintTicket } from '../types/PrintTicket';

export interface PrintJobDto {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  expireAt: Date;
  userId: string;
  numPrintPages: number;
  verificationNumber: string;
  ticket: PrintTicket;
  price: number;
  kiosk: {
    id: string;
    name: string;
    description: string;
    color: boolean;
    mono: boolean;
  };
  files: {
    id: string;
    createdAt: Date;
    modifiedAt: Date;
    name: string;
    size: number;
    isConverted: boolean;
    errorType: PrintJobErrorType | null;
  }[];
}
