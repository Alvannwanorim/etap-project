import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPE } from 'src/user/enums/user.enums';
import { ROLE_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<USER_TYPE[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) => user.user_type?.includes(role));
  }
}
