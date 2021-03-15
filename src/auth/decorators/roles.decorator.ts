import {applyDecorators, SetMetadata, UseGuards} from '@nestjs/common';
import config from '../../configuration/default';
import {JwtAuthGuard} from '../guards/jwt.guard';

export const ROLES_METADATA_KEY = Symbol('roles')

const RoleAccess = (roles: string[]) =>
    applyDecorators(
        SetMetadata(ROLES_METADATA_KEY, roles),
        UseGuards(JwtAuthGuard),
    );

export const LoggedInAccess = () => RoleAccess([])
export const UserAccess = () => RoleAccess([config().security.roles.user])
export const AdminAccess = () => RoleAccess([config().security.roles.admin])
