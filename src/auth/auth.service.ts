import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { AuthData, LogoutOptions } from '../interfaces';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  private REFRESH_COOKIE: string;
  private USERUID_COOKIE: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {
    this.REFRESH_COOKIE = this.configService.get<string>(
      'security.cookie.refresh',
      'rt',
    );
    this.USERUID_COOKIE = this.configService.get<string>(
      'security.cookie.userUID',
      'uuid',
    );
  }

  async authenticate(req: Request): Promise<AuthData> {
    const authenticationData = this.getAuthenticationDataFromRequest(req);

    if (!authenticationData.userUID) {
      authenticationData.userUID = uuid.v4();
    }

    let user;

    if (authenticationData.login) {
      user = await this.userService.findOne(authenticationData.login);
    } else {
      return {
        error: 401,
        access: null,
        refresh: null,
        userUID: null,
      };
    }

    if (!user) {
      return {
        error: 404,
        access: null,
        refresh: null,
        userUID: null,
      };
    }

    const isMatch = await bcrypt.compare(
      authenticationData.password,
      user.password,
    );

    if (!isMatch)
      return {
        error: 401,
        access: null,
        refresh: null,
        userUID: null,
      };

    const { access, refresh } = await this.tokenService.createTokens(
      user,
      authenticationData.userUID,
    );

    return {
      access,
      refresh,
      userUID: authenticationData.userUID,
    };
  }

  async verifyAccess(req: Request, allowedRoles?: string[]) {
    const { access, userUID } = this.getCredentialsFromRequest(req);

    if (access && userUID) {
      try {
        const userFindings = await this.tokenService.checkAccessToken(
          access,
          userUID,
        );

        let allowAccess = false;

        if (userFindings) {
          if (!allowedRoles || allowedRoles.length === 0) {
            allowAccess = true;
          }

          if (userFindings.userRoles && userFindings.userRoles.length > 0) {
            userFindings.userRoles.map(role => {
              if (
                allowedRoles.includes(role) ||
                role === this.configService.get<string>('security.roles.admin')
              ) {
                allowAccess = true;
              }
            });
          }
        }

        if (allowAccess) {
          return { result: true, payload: userFindings, access, userUID };
        } else {
          return { result: false, error: 403, message: 'Access denied' };
        }
      } catch (error) {
        //TokenExpiredError
        //JsonWebTokenError
        //NotBeforeError
        return { result: false, error: error.name, message: error.message };
      }
    } else {
      return {
        result: false,
        error: 400,
        message: 'Access denied, credentials needed',
      };
    }
  }

  async refreshAccess(req: Request) {
    const { access, refresh, userUID } = this.getCredentialsFromRequest(req);

    if (access && refresh && userUID) {
      const newTokens = await this.tokenService.refreshTokens(
        access,
        refresh,
        userUID,
      );
      if (newTokens) {
        return {
          result: true,
          access: newTokens.access,
          refresh: newTokens.refresh,
          userUID,
        };
      } else {
        return {
          result: false,
          error: 400,
          message: 'Refreshing failed',
        };
      }
    } else {
      return {
        result: false,
        error: 400,
        message: 'Refreshing denied, credentials needed',
      };
    }
  }

  /**
   * For logout all devices you need enter current user's id or all:true and current user's uid
   * For logout user only on current device enter only current user's uid
   * @param logoutOptions
   */

  async logout(logoutOptions: LogoutOptions) {
    if (logoutOptions.all) {
      await this.tokenService.invalidateAll(logoutOptions.userUID);
    } else if (logoutOptions.userUID) {
      await this.tokenService.invalidateOne(logoutOptions.userUID);
    } else if (logoutOptions.userId) {
      await this.tokenService.invalidateById(logoutOptions.userId);
    } else {
      return false;
    }
    return true;
  }

  getCookiesConfiguration() {
    return {
      // domain: ".super.com",
      path: this.configService.get<string>('security.cookie.path', '/graphql'),
      httpOnly: true,
      secure: true,
      expires: new Date(
        Date.now() +
          this.configService.get<number>('security.lifetime.refresh') * 1000,
      ),
      maxAge:
        this.configService.get<number>('security.lifetime.refresh') * 1000,
      signed: true,
    };
  }

  getCookiesNames() {
    return {
      refresh: this.REFRESH_COOKIE,
      userUID: this.USERUID_COOKIE,
    };
  }

  getCredentialsFromRequest(req: Request): AuthData {
    const userUID: string = req.signedCookies
      ? req.signedCookies[this.USERUID_COOKIE]
      : null;
    const access: string = req.headers?.authorization?.split(' ')[1];
    const refresh: string = req.signedCookies
      ? req.signedCookies[this.REFRESH_COOKIE]
      : null;
    return { access, refresh, userUID };
  }

  private getAuthenticationDataFromRequest(req: Request) {
    const login: string = <string>req.headers?.login;
    const password: string = <string>req.headers?.password;
    const userUID: string = req.signedCookies
      ? req.signedCookies[this.USERUID_COOKIE]
      : null;
    return { login, password, userUID };
  }
}
