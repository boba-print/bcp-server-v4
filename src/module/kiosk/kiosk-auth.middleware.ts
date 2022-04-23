import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { PrismaService } from 'src/service/prisma.service';
import { AuthRequest } from '../../common/interface/AuthRequest';

@Injectable()
export class KioskAuthMiddleware implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const { claims } = req;

    if (!claims || !claims.uid) {
      console.log('[KioskAuthMiddleware] There is no claims');
      throw new HttpException('Forbidden', 403);
    }
    const { uid } = claims;

    const kiosk = await this.prismaService.kiosks.findUnique({
      where: {
        KioskID: uid,
      },
    });

    if (!kiosk) {
      console.log('[KioskAuthMiddleware] There is no corresponding kiosk');
      throw new HttpException('Forbidden', 403);
    }

    req['kiosk'] = kiosk;
    next();
  }
}
