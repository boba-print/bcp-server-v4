import { Users } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';


export class UserEntity implements Users {
  @IsString()
  UserID: string;

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
  Email: string;

  @IsDate()
  @Type(() => Date)
  CheckedNoticeAt: Date | null;

  @IsDate()
  @Type(() => Date)
  LastVisitedAt: Date | null;

  @IsBoolean()
  @Type(() => Boolean)
  IsDisabled: number;

  @IsString()
  Name: string;

  @IsString()
  PhoneNumber: string;

  @IsInt()
  Points: number;

  @IsInt()
  StorageAllocated: bigint;

  @IsInt()
  StorageUsed: bigint;
}