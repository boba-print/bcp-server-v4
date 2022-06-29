import { IsDecimal, IsPhoneNumber, Length } from 'class-validator';

export class PhoneAuthVerifyDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @Length(6)
  @IsDecimal()
  verifyNumber: string;
}
