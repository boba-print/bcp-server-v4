import { Users } from '@prisma/client';
import { AuthRequest } from '../../common/interface/AuthRequest';

export interface ClientAuthRequest extends AuthRequest {
  user: Users;
}
