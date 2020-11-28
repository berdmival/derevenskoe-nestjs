import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class PasswordAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const { req } = GqlExecutionContext.create(context).getContext();
    const authResult = await this.authService.authenticate(req);
    req['credentials'] = authResult;

    const cookieConfig = this.authService.getCookiesConfiguration();

    req.res.cookie(
      this.authService.getCookiesNames().refresh,
      authResult.refresh,
      cookieConfig,
    );
    req.res.cookie(
      this.authService.getCookiesNames().userUID,
      authResult.userUID,
      cookieConfig,
    );
    req.res.header('Authorization', 'Bearer ' + authResult.access);
    return !!authResult.userUID;
  }
}
