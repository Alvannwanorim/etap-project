import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from 'src/user/enums/user.enums';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: USER_TYPE[]) => SetMetadata(ROLE_KEY, roles);
