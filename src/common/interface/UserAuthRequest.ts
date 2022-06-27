import { Users } from '@prisma/client';
import { AuthRequest } from './AuthRequest';

export interface UserAuthRequest extends AuthRequest {
  user: Users;
}
