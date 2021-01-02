import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthData } from 'src/interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class PasswordAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const { req } = GqlExecutionContext.create(context).getContext();
    const authResult: AuthData = await this.authService.authenticate(req);
    req['credentials'] = authResult;
    req.res = this.authService.setCredentialsToResponse(req.res, authResult);

    return !!authResult.userUID;
  }
}
