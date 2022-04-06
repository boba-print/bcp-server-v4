import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { KioskEntity } from 'src/domain/kiosk.entity';
import { PrismaService } from 'src/service/prisma.service';
import { AuthRequest } from '../../common/interface/AuthRequest';

@Injectable()
export class KioskAuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const { claims } = req;
    if (!claims || !claims.uid) {
      return res.sendStatus(403).send({});
    }
    const { uid } = claims;
    const kiosk = await this.prismaService.kiosks.findUnique({
      where: {
        KioskID: uid,
      },
    });
    if (!kiosk) {
      return res.sendStatus(403).send({});
    }

    res['kiosk'] = new KioskEntity(kiosk);
    next();
  }
}
