import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import * as admin from 'firebase-admin';
import { AuthRequest } from '../interface/AuthRequest';

@Injectable()
export class PreauthMiddleWare implements NestMiddleware {
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token || !token.includes('Bearer ', 0)) {
      return next();
    }

    try {
      const decodedToken = await admin
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''));
      // TODO: 안전한 Typing 을 위한 더 나은 방법?
      req.claims = decodedToken;
      next();
    } catch (err) {
      console.info('Access Denied');
      res.status(403).json({
        statusCode: 403,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: 'Access Denied',
      });
    }
  }
}
