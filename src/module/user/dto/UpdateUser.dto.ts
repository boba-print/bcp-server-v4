import { IsBoolean, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 45)
  name: string;

  @IsBoolean()
  isDeleted: boolean;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  phoneAuthSessionKey: string;
}
