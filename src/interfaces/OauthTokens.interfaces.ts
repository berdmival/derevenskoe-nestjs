export interface OauthTokensIndex {
  [key: string]: number;
}
export interface OauthTokensUserGroup {
  [key: string]: OauthTokensDeviceGroup;
}
export interface OauthTokensDeviceGroup {
  access: string;
  [key: string]: string;
}
export interface OauthTokens {
  indexes: OauthTokensIndex;
  tokens: {
    [key: number]: OauthTokensUserGroup;
  };
}
export interface AccessTokenPayload {
  userId: number;
  userRoles: string[];
}

export interface RefreshUser {
  id: number;
  userRoles: string[];
}

export interface RefreshTokenPayload {
  access: string;
  user: RefreshUser;
}
