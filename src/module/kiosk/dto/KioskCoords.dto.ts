import { Exclude, Expose } from 'class-transformer';

/**
 * Kiosk Relation 데이터를 Dto 로 매핑함
 */
@Exclude()
export class KioskCoordsDto {
  @Expose({ name: 'Name' })
  n: string;

  @Expose({ name: 'Latitude' })
  y: number;

  @Expose({ name: 'Longitude' })
  x: number;

  @Expose({ name: 'PriceA4Color' })
  c: number | null;

  @Expose({ name: 'PriceA4Mono' })
  m: number | null;
}
