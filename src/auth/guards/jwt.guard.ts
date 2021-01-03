import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthData } from 'src/interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const { req } = GqlExecutionContext.create(context).getContext();
    const roles = this.reflector.getAllAndMerge<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    const verifyAccessResult = await this.authService.verifyAccess(req, roles);

    if (verifyAccessResult.result) {
      const authData: AuthData = {
        access: verifyAccessResult.access,
        refresh: verifyAccessResult.refresh,
        userUID: verifyAccessResult.userUID,
      };
      req['credentials'] = authData;
      req['user'] = verifyAccessResult.payload;

      if (context.getHandler().name === 'logout') {
        req.res = this.authService.clearCredentials(req.res);
      } else {
        req.res = this.authService.setCredentialsToResponse(req.res, authData);
      }
    }

    return verifyAccessResult.result;
  }
}
