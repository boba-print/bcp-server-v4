import { Kiosks } from '@prisma/client';
import { AuthRequest } from '../../common/interface/AuthRequest';

export interface KioskAuthRequest extends AuthRequest {
  kiosk: Kiosks;
}
