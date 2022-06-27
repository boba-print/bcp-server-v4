import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { KioskAuthRequest } from '../interface/KioskAuthRequest';

/**
 * 키오스크 컨트롤러에서 `:id` param 으로 들어오는 값이
 * auth middleware 를 통해 받은 `kiosk` 객체와 일치하는지 확인
 */
@Injectable()
export class KioskAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<KioskAuthRequest>();
    const { id } = req.params;
    if (!id) {
      return true;
    }

    const { kiosk } = req;
    return kiosk.KioskID === id;
  }
}
