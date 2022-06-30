import { IsString, Length } from 'class-validator';

export class PasscodeVerifyDto {
  @Length(5)
  @IsString()
  passcode: string;
}
