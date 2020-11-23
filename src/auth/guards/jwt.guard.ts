import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const { req } = GqlExecutionContext.create(context).getContext();
    const roles = this.reflector.getAllAndMerge<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    const verifyAccessResult = await this.authService.verifyAccess(req, roles);
    return verifyAccessResult.result;
  }
}
