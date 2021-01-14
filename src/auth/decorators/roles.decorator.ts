import {applyDecorators, SetMetadata, UseGuards} from '@nestjs/common';
import config from '../../configuration/default';
import {JwtAuthGuard} from '../guards/jwt.guard';

// TODO: take values from config

export const UserAccess = () =>
    applyDecorators(
        SetMetadata('role', config().security.roles.user),
        UseGuards(JwtAuthGuard),
    );

export const AdminAccess = () =>
    applyDecorators(
        SetMetadata('role', config().security.roles.admin),
        UseGuards(JwtAuthGuard),
    );
