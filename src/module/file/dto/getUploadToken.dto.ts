import { IsEnum, IsString } from 'class-validator';
import { Type } from '../types/Type';

export class GetUploadToken {
  @IsEnum(Type)
  @IsString()
  type: string;
}
