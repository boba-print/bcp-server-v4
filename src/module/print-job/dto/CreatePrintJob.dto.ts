import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePrintJobDto {
  @IsString()
  kioskId: string;

  @IsString()
  fileId: string;

  @IsOptional()
  @IsNumber()
  numPrintPages: number | null;

  @IsNumberString()
  verificationNumber: string;

  @IsNumber()
  numCopies: number;

  @IsString()
  pageFitting: string;

  @IsString()
  duplex: string;

  @IsNumber()
  nUp: number;

  @IsString()
  layoutOrder: string;

  @IsString()
  paperOrientation: string;

  @IsNumber()
  isColor: number;

  @IsString()
  pageRanges: string;
}
