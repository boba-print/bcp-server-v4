import { IsInt, IsString } from 'class-validator';

export class KioskDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;
}
