import { IsString } from 'class-validator';

export class KioskHeartBeatDto {
  @IsString()
  currentPage: string;
}
