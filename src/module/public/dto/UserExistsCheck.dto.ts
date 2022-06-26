import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';

export class UserExistCheckDto {
  @IsEmail()
  @IsOptional()
  Email?: string;

  @IsMobilePhone()
  @IsOptional()
  PhoneNumber?: string;
}
