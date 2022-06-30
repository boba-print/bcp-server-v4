import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { PrismaService } from 'src/service/prisma.service';
import { AuthRequest } from '../interface/AuthRequest';

@Injectable()
export class KioskAuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const { claims } = req;

    if (!claims || !claims.uid) {
      return next();
    }
    const { uid } = claims;

    const kiosk = await this.prismaService.kiosks.findUnique({
      where: {
        KioskID: uid,
      },
    });

    req['kiosk'] = kiosk ?? undefined;
    next();
  }
}
