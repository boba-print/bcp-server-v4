import { IsEnum, IsNumber, IsString, Matches, Max, Min } from 'class-validator';
import { Duplex } from '../types/Duplex';
import { LayoutOrder } from '../types/LayoutOrder';
import { NUp } from '../types/NUp';
import { PageFitting } from '../types/PageFitting';
import { PaperOrientation } from '../types/PaperOrientation';

export class CreatePrintJobDto {
  @IsString()
  kioskId: string;

  @IsString()
  fileId: string;

  @Max(999)
  @Min(1)
  @IsNumber()
  numCopies: number;

  @IsEnum(PageFitting)
  @IsString()
  pageFitting: string;

  @IsEnum(Duplex)
  @IsString()
  duplex: string;

  @IsEnum(NUp)
  @IsNumber()
  nUp: number;

  @IsEnum(LayoutOrder)
  @IsString()
  layoutOrder: string;

  @IsEnum(PaperOrientation)
  @IsString()
  paperOrientation: string;

  @IsNumber()
  isColor: number;

  //TODO: regexp 를 최대한 활용한 validation
  @IsString()
  pageRanges: string;
}
