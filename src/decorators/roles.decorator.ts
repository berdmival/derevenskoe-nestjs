import { SetMetadata } from '@nestjs/common';
import config from '../configuration/default';

// TODO: take values from config

export const UserAccess = () =>
  SetMetadata('role', config().security.roles.user);

export const AdminAccess = () =>
  SetMetadata('role', config().security.roles.admin);
