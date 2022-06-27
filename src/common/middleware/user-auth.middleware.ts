import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { PrismaService } from 'src/service/prisma.service';
import { AuthRequest } from '../interface/AuthRequest';

@Injectable()
export class UserAuthMiddleWare implements NestMiddleware {
  constructor(private readonly prismaService: PrismaService) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const { claims } = req;

    if (!claims || !claims.uid) {
      console.log('[UserAuthMiddleWare] There is no claims');
      throw new HttpException('Forbidden', 403);
    }
    const { uid } = claims;

    const user = await this.prismaService.users.findUnique({
      where: {
        UserID: uid,
      },
    });

    if (!user) {
      console.log('[UserAuthMiddleWare] There is no corresponding user');
      throw new HttpException('Forbidden', 403);
    }

    req['user'] = user;
    next();
  }
}
