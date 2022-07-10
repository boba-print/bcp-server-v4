import { IsCreditCard, IsString } from 'class-validator';

class CardCreateDto {
  @IsCreditCard()
  @IsString()
  cardNumber: string;
}
