import { Injectable } from '@nestjs/common';
import { Kiosks } from '@prisma/client';

@Injectable()
export class KioskMapper {
  mapFromRelation(kiosk: Kiosks) {
    return {
      id: kiosk.KioskID,
      name: kiosk.Name,
      description: kiosk.Description,
      color: !!kiosk.PriceA4Color,
      mono: !!kiosk.PriceA4Mono,
    };
  }
}
