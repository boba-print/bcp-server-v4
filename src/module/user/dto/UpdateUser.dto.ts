import { IsBoolean, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 45)
  @IsString()
  name: string;

  @IsBoolean()
  isDeleted: boolean;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  phoneAuthSessionKey?: string;
}
