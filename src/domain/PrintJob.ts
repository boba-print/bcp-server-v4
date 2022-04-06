import { PrintJobs } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { UserEntity } from './User.entity';

type joined = PrintJobs & { User: UserEntity };
export class PrintJobEntity implements joined {
  @IsString()
  PrintJobID: string;

  @IsDate()
  @Type(() => Date)
  CreatedAt: Date;

  @IsDate()
  @Type(() => Date)
  ModifiedAt: Date;

  @IsBoolean()
  @Type(() => Boolean)
  IsDeleted: number;

  @IsString()
  KioskID: string;

  @IsString()
  UserID: string;

  @IsString()
  FileID: string;

  @IsNumber()
  NumPrintPages: number | null;

  @IsString()
  VerificationNumber: string;

  @IsInt()
  NumCopies: number;

  @IsString()
  PageFitting: string;

  @IsString() // TODO: Convert to IsEnum
  Duplex: string;

  @IsInt() // TODO: Convert to IsEnum
  NUp: number;

  @IsString() // TODO: Convert to IsEnum
  LayoutOrder: string;

  @IsString() // TODO: Convert to IsEnum
  PaperOrientation: string;

  @IsBoolean()
  @Type(() => Boolean)
  IsColor: number;

  @IsString()
  PageRanges: string;

  // Relation Field
  User: UserEntity;

  
}
