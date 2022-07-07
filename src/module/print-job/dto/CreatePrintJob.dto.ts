import {
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreatePrintJobDto {
  @IsString()
  kioskId: string;

  @IsString()
  fileId: string;

  @Max(999)
  @Min(1)
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
