import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/utils';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
