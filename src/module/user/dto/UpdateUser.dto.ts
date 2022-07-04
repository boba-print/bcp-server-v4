import { IsNumber, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 45)
  name: string;

  @IsNumber()
  isDeleted: number;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  phoneAuthSessionKey: string;
}
