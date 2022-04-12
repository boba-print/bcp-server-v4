import { Kiosks } from '@prisma/client';
import { Request } from 'express';

export enum ClaimType {
  Client = 'client',
  Manager = 'manager',
  Master = 'master',
  Admin = 'admin', // Will deprecate
}

export interface AuthRequest extends Request {
  claims?: { uid: string | undefined; type: ClaimType | undefined };
}

export interface KioskAuthRequest extends AuthRequest {
  kiosk: Kiosks;
}
