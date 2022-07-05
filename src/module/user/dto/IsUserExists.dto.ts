import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator';

export class IsUserExistsDto {
  @IsEmail()
  @IsOptional()
  Email?: string;

  @IsMobilePhone()
  @IsOptional()
  PhoneNumber?: string;
}
