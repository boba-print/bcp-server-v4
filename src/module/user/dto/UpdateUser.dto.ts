import {
  IsBoolean,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @Length(2, 45)
  @IsString()
  @IsOptional()
  name?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  phoneAuthSessionKey?: string;
}
// number overlap  sessionkey
