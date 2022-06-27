import { Kiosks } from '@prisma/client';
import { AuthRequest } from './AuthRequest';

export interface KioskAuthRequest extends AuthRequest {
  kiosk: Kiosks;
}
