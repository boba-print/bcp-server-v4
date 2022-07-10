import { IsString } from 'class-validator';

export class UpdateCouponDto {
  @IsString()
  couponId: string;
}
