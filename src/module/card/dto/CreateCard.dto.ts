import { IsCreditCard, IsString, Length, Matches } from 'class-validator';

export class CreateCardDto {
  @IsCreditCard()
  @IsString()
  cardNumber: string;

  @Matches(/^[0-9]{4}-[0-9]{2}$/)
  @IsString()
  expiry: string; // 2024-01 카드형식

  @Length(6, 10)
  @IsString()
  birth: string; // 생년월일 950819, 사업자번호 10자리

  @Length(2)
  @IsString()
  pwd2digit: string; // 카드 비밀번호 앞 두자리
}
