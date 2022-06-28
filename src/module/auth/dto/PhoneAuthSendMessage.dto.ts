import { IsMobilePhone } from 'class-validator';

export class PhoneAuthSendMessageDto {
  @IsMobilePhone()
  phoneNumber: string;
}
