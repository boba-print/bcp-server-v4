import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token || !token.includes('Bearer ', 0)) {
      return next();
    }

    try {
      const decodedToken = await admin
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''));
      // TODO: 안전한 Typing 을 위한 더 나은 방법?
      req['claims'] = decodedToken;
      return next();
    } catch (err) {
      return next();
    }
  }
}
