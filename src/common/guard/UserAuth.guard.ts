import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserAuthRequest } from '../interface/UserAuthRequest';

/**
 * 키오스크 컨트롤러에서 `:id` param 으로 들어오는 값이
 * auth middleware 를 통해 받은 `user` 객체와 일치하는지 확인
 */
@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<UserAuthRequest>();

    const { user } = req;
    if (!user) {
      return false;
    }

    const { id } = req.params;
    if (!id) {
      return true;
    }

    return user.UserID === id;
  }
}
