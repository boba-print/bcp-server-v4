import { IsOptional, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  name?: string;
}
