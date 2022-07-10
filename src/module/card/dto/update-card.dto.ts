import { IsString } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  rejectionMessage: string;
}
