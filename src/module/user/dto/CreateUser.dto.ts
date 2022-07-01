import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @Length(6, 100)
  @IsString()
  password: string;

  @IsString()
  @Length(2, 45)
  name: string;
}
