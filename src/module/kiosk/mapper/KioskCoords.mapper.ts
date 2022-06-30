import { Expose } from 'class-transformer';

/**
 * Kiosk Relation 데이터를 Dto 로 매핑함
 */
export class KioskCoordsMapper {
  n: string;
  y: number;
  x: number;
  c: number;
  m: number;

  @Expose({ name: 'n' })
  Name: string;

  @Expose({ name: 'y' })
  Latitude: number;

  @Expose({ name: 'x' })
  Longitude: number;

  @Expose({ name: 'c' })
  PriceA4Color: number;

  @Expose({ name: 'm' })
  PriceA4Mono: number;
}
