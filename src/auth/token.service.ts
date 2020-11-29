import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenPayload,
  OauthTokens,
  RefreshTokenPayload,
  RefreshUser,
} from '../interfaces';
import { RoleEntity } from '../user/entities/role.entity';
import { UserEntity } from '../user/entities/user.entity';
import * as uuid from 'uuid';

@Injectable()
export class TokenService {
  //TODO: move to better storage and synchronize it between clusters

  // const tokens = {
  //   indexes: {
  //     uuid1: uid1,
  //     uuid2: uid1,
  //     uuid3: uid1,
  //     uuid4: uid2,
  //     uuid5: uid2,
  //     uuid6: uid2,
  //   }
  //   tokens: {
  //     uid1 : {
  //       uuid1: {access: access1, refreshId1: refresh1}
  //       uuid2: {access: access2, refreshId2: refresh2}
  //       uuid3: {access: access3, refreshId3: refresh3}
  //     },
  //     uid2 : {
  //       uuid4: {access: access4, refreshId4: refresh4}
  //       uuid5: {access: access5, refreshId5: refresh5}
  //       uuid6: {access: access6, refreshId6: refresh6}
  //     }
  //   }
  // }
  private tokens: OauthTokens = { indexes: {}, tokens: {} };

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async checkAccessToken(access: string, userUID: string) {
    const userId = this.tokens.indexes[userUID];
    if (
      userId &&
      // this.tokens.tokens[userId] &&
      // this.tokens.tokens[userId][userUID] &&
      // this.tokens.tokens[userId][userUID].access &&
      this.tokens.tokens?.[userId]?.[userUID]?.access === access
    ) {
      const userFindings = await this.jwtService.verifyAsync<
        AccessTokenPayload
      >(access, { secret: <string>process.env.TOKEN_SECRET });

      return userFindings;
    } else {
      return null;
    }
  }

  async refreshTokens(access: string, refresh: string, userUID: string) {
    const userId = this.tokens.indexes[userUID];
    if (
      userId &&
      // this.tokens.tokens[userId] &&
      // this.tokens.tokens[userId][userUID] &&
      this.tokens.tokens?.[userId]?.[userUID]?.[refresh]
    ) {
      try {
        const payloadFromRefresh = await this.jwtService.verifyAsync<
          RefreshTokenPayload
        >(this.tokens.tokens[userId][userUID][refresh], {
          secret: <string>process.env.TOKEN_SECRET,
        });

        const user = payloadFromRefresh.user;

        await this.invalidateOne(userUID);

        if (access === payloadFromRefresh.access && user) {
          return await this.createTokens(user, userUID);
        }

        return null;
      } catch (error) {
        await this.invalidateOne(userUID);
        return null;
      }
    } else {
      await this.invalidateOne(userUID);
      return null;
    }
  }

  async invalidateOne(userUID: string) {
    const userId = this.tokens.indexes?.[userUID];
    delete this.tokens.tokens?.[userId]?.[userUID];
    delete this.tokens.indexes?.[userUID];
  }

  async invalidateAll(userUID: string) {
    const userId = this.tokens.indexes?.[userUID];
    this.invalidateById(userId);
  }

  async invalidateById(userId: number) {
    if (this.tokens.tokens?.[userId]) {
      Object.keys(this.tokens.tokens[userId]).forEach(uuid =>
        this.invalidateOne(uuid),
      );
    }
  }

  private async createRefresh(
    access: string,
    user: UserEntity | RefreshUser,
    userUID: string,
  ) {
    const refresh = await this.jwtService.signAsync(
      { access, user: { id: user.id, Roles: this.getFormattedRoles(user) } },
      {
        secret: <string>process.env.TOKEN_SECRET,
        expiresIn: this.configService.get<number>('security.lifetime.refresh'),
      },
    );
    const refreshId = uuid.v4();
    this.tokens.tokens[user.id][userUID][refreshId] = refresh;
    return refreshId;
  }

  private async createAccess(user: UserEntity | RefreshUser, userUID: string) {
    const access = await this.jwtService.signAsync(
      { userId: user.id, userRoles: this.getFormattedRoles(user) },
      {
        secret: <string>process.env.TOKEN_SECRET,
        expiresIn: this.configService.get<number>('security.lifetime.access'),
      },
    );

    this.tokens.tokens[user.id][userUID].access = access;
    return access;
  }

  async createTokens(user: UserEntity | RefreshUser, userUID: string) {
    this.tokens.indexes[userUID] = user.id;
    this.tokens.tokens[user.id] = {
      ...this.tokens.tokens?.[user.id],
      [userUID]: {},
    };

    const access = await this.createAccess(user, userUID);
    const refresh = await this.createRefresh(access, user, userUID);
    return { access, refresh };
  }

  private getFormattedRoles = (user: any): string[] => {
    let formattedRoles: string[] = [];

    if (user.Roles && user.Roles.length > 0) {
      formattedRoles = user.Roles.reduce(
        (total: string[], current: RoleEntity) => {
          total.push(current.name);
          return total;
        },
        [],
      );
    }
    return formattedRoles;
  };
}
