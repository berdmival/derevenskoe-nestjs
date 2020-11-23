// import * as uuid from 'uuid';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import config from 'config';

// import { User, Role } from '../models';

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

// import {
//   OauthTokens,
//   AccessTokenPayload,
//   RefreshTokenPayload,
//   RefreshUser,
// } from '../interfaces';
// const tokens: OauthTokens = { indexes: {}, tokens: {} };

// export const authenticate = async (
//   login: string,
//   password: string,
//   userUID: string | null,
// ) => {
//   const user: User = await User.findOne({
//     where: { phone: login },
//     include: ['roles'],
//   });

//   if (!user) {
//     return { error: 404 };
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) return { error: 401 };

//   if (!userUID) {
//     userUID = uuid.v4();
//   }

//   const { access, refreshId } = await createTokens(user, userUID);

//   return { access, refreshId, userUID, userId: user.id };
// };

// export const verifyAccess = async (
//   access: string,
//   userUID: string,
//   allowedRoles?: string[],
// ) => {
//   if (access && userUID) {
//     const userId = tokens.indexes[userUID];
//     if (
//       userId &&
//       tokens.tokens[userId] &&
//       tokens.tokens[userId][userUID] &&
//       tokens.tokens[userId][userUID].access &&
//       tokens.tokens[userId][userUID].access === access
//     ) {
//       try {
//         const userFindings = <AccessTokenPayload>(
//           jwt.verify(access, <string>process.env.TOKEN_SECRET)
//         );

//         let rolePresent = false;

//         if (userFindings.userRoles && userFindings.userRoles.length > 0) {
//           userFindings.userRoles.map(role => {
//             if (
//               !allowedRoles ||
//               allowedRoles.length === 0 ||
//               allowedRoles.includes(role) ||
//               role === config.get('security.roles.admin')
//             ) {
//               rolePresent = true;
//             }
//           });
//         }

//         if (rolePresent) {
//           return { result: true, payload: userFindings };
//         } else {
//           return { result: false, error: 403, message: 'Access denied' };
//         }
//       } catch (error) {
//         //TokenExpiredError
//         //JsonWebTokenError
//         //NotBeforeError
//         return { result: false, error: error.name, message: error.message };
//       }
//     } else {
//       return { result: false, error: 400, message: 'Verifying denied' };
//     }
//   } else {
//     return { result: false, error: 400, message: 'Verifying denied' };
//   }
// };

// export const refreshAccess = async (
//   access: string,
//   refresh: string,
//   userUID: string,
// ) => {
//   if (access && refresh && userUID) {
//     const userId = tokens.indexes[userUID];
//     if (
//       userId &&
//       tokens.tokens[userId] &&
//       tokens.tokens[userId][userUID] &&
//       tokens.tokens[userId][userUID][refresh]
//     ) {
//       try {
//         const payloadFromRefresh = await (<RefreshTokenPayload>(
//           jwt.verify(
//             tokens.tokens[userId][userUID][refresh],
//             <string>process.env.TOKEN_SECRET,
//           )
//         ));

//         const user = payloadFromRefresh.user;

//         await invalidateOne(userUID);

//         if (access === payloadFromRefresh.access && user) {
//           const newTokens = await createTokens(user, userUID);
//           return {
//             result: true,
//             access: newTokens.access,
//             refresh: newTokens.refreshId,
//             userUID,
//           };
//         }

//         return {
//           result: false,
//           error: 400,
//           message: 'Refreshing denied, access not ident',
//         };
//       } catch (error) {
//         //TokenExpiredError
//         //JsonWebTokenError
//         //NotBeforeError
//         await invalidateOne(userUID);
//         return { result: false, error: error.name, message: error.message };
//       }
//     } else {
//       await invalidateOne(userUID);
//       return {
//         result: false,
//         error: 400,
//         message: 'Refreshing denied, refresh not found',
//       };
//     }
//   } else {
//     return {
//       result: false,
//       error: 400,
//       message: 'Refreshing denied, arguments needed',
//     };
//   }
// };

// export const invalidateOne = async (userUID: string) => {
//   const userId = tokens.indexes[userUID];
//   delete tokens.tokens[userId][userUID];
//   delete tokens.indexes[userUID];
// };

// export const invalidateAll = async (userUID: string) => {
//   const userId = tokens.indexes[userUID];
//   invalidateById(userId);
// };

// export const invalidateById = async (userId: number) => {
//   Object.keys(tokens.tokens[userId]).forEach(uuid => invalidateOne(uuid));
// };

// const createRefresh = async (
//   access: string,
//   user: User | RefreshUser,
//   userUID: string,
// ) => {
//   const refresh = await jwt.sign(
//     { access, user: { id: user.id, Roles: getFormattedRoles(user) } },
//     <string>process.env.TOKEN_SECRET,
//     {
//       expiresIn: config.get('security.lifetime.refresh'),
//     },
//   );
//   const refreshId = uuid.v4();
//   tokens.tokens[user.id][userUID][refreshId] = refresh;
//   return refreshId;
// };

// const createAccess = async (user: User | RefreshUser, userUID: string) => {
//   const access = await jwt.sign(
//     { userId: user.id, userRoles: getFormattedRoles(user) },
//     <string>process.env.TOKEN_SECRET,
//     {
//       expiresIn: config.get('security.lifetime.access'),
//     },
//   );

//   tokens.tokens[user.id][userUID].access = access;
//   return access;
// };

// const createTokens = async (user: User | RefreshUser, userUID: string) => {
//   tokens.indexes[userUID] = user.id;
//   tokens.tokens[user.id] = {
//     ...tokens.tokens[user.id],
//     [userUID]: { access: '' },
//   };

//   const access = await createAccess(user, userUID);
//   const refreshId = await createRefresh(access, user, userUID);
//   return { access, refreshId };
// };

// const getFormattedRoles = (user: any): string[] => {
//   let formattedRoles: string[] = [];

//   if (user.Roles && user.Roles.length > 0) {
//     formattedRoles = user.Roles.reduce((total: string[], current: Role) => {
//       total.push(current.name);
//       return total;
//     }, []);
//   }

//   return formattedRoles;
// };

// const COOKIE_PATH: string = config.get("security.cookie.path") || "/graphql";
// const REFRESH_COOKIE: string = config.get("security.cookie.refresh") || "rt";
// const USERUID_COOKIE: string = config.get("security.cookie.userUID") || "uuid";

// const cookiesConfiguration = () => {
//   return {
//     // domain: ".super.com",
//     path: COOKIE_PATH,
//     httpOnly: true,
//     secure: true,
//     expires: new Date(
//       Date.now() + <number>config.get("security.lifetime.refresh") * 1000
//     ),
//     maxAge: <number>config.get("security.lifetime.refresh") * 1000,
//     signed: true,
//   };
// };

// export const verifyToken = async (
//   { req }: ExpressContext,
//   roles?: string[]
// ) => {
//   try {
//     const userUID: string = req?.signedCookies[USERUID_COOKIE];
//     const access = req?.headers?.authorization?.split(" ")[1];

//     if (userUID && access) {
//       const result = await oauth2server.verifyAccess(access, userUID, roles);

//       return result;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return error;
//   }
// };

// export const refreshToken = async ({ req }: ExpressContext) => {
//   try {
//     const userUID: string = req.signedCookies[USERUID_COOKIE];
//     const access = req.headers?.authorization?.split(" ")[1];
//     const refresh: string = req.signedCookies[REFRESH_COOKIE];

//     if (userUID && access && refresh) {
//       const result = await oauth2server.refreshAccess(access, refresh, userUID);

//       if (
//         !result.result ||
//         result.error === 400 ||
//         result.error === "TokenExpiredError"
//       ) {
//         if (req.res) {
//           req.res.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
//         }
//         return null;
//       }

//       const cookieConfig = cookiesConfiguration();
//       if (req.res) {
//         req.res.cookie(REFRESH_COOKIE, result.refresh, cookieConfig);
//         req.res.cookie(USERUID_COOKIE, result.userUID, cookieConfig);
//         req.res.header("Authorization", "Bearer " + result.access);
//       }

//       return true;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return false;
//   }
// };

// const getAccess = async ({ req }: ExpressContext, roles?: string[]) => {
//   try {
//     const userUID: string = req?.signedCookies[USERUID_COOKIE];
//     const access = req?.headers?.authorization?.split(" ")[1];
//     const refresh: string = req.signedCookies[REFRESH_COOKIE];

//     if (userUID && access && refresh) {
//       const token = await oauth2server.verifyAccess(access, userUID, roles);
//       if (token.result) {
//         return token;
//       } else {
//         if (token.error === "TokenExpiredError") {
//           const newToken = await oauth2server.refreshAccess(
//             access,
//             refresh,
//             userUID
//           );
//           if (newToken.result) return newToken;
//           else return null;
//         } else return null;
//       }
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return error;
//   }
// };

// export const registerUser = async (user) => {
//   try {
//     const salt = parseInt(<string>process.env.USER_SALT);
//     const hashedPassword = await bcrypt.hash(user.password, salt);

//     const newUser = { ...user, password: hashedPassword };

//     const [userRole] = await (<Promise<Role[]>>Role.findOrCreate({
//       where: { name: config.get("security.roles.user") },
//     }));

//     const createdUser: User = await (<Promise<User>>User.create(newUser));
//     await createdUser.addRole(userRole);

//     return await User.findOne({
//       where: { id: createdUser.id },
//       include: ["roles"],
//     });
//   } catch (error) {
//     return error;
//   }
// };

// export const loginUser = async (
//   { login, password },
//   { req }: ExpressContext
// ) => {
//   try {
//     let userUID: string | null = null;
//     if (req.signedCookies) {
//       userUID = req.signedCookies[USERUID_COOKIE];
//     }

//     const token = await oauth2server.authenticate(login, password, userUID);

//     if (token.error) {
//       return null;
//     }

//     const cookieConfig = cookiesConfiguration();

//     if (req.res) {
//       req.res.cookie(REFRESH_COOKIE, token.refreshId, cookieConfig);
//       req.res.cookie(USERUID_COOKIE, token.userUID, cookieConfig);
//       req.res.header("Authorization", "Bearer " + token.access);
//     }

//     return await User.findOne({
//       where: { id: <number>token.userId },
//       include: ["roles", "addresses"],
//     });
//   } catch (error) {
//     return error;
//   }
// };

// export const logoutUser = async ({ req }: ExpressContext, all?: boolean) => {
//   try {
//     let userUID: string | null = null;
//     if (req.signedCookies) {
//       userUID = req.signedCookies[USERUID_COOKIE];
//     } else return null;

//     if (userUID) {
//       if (all) {
//         await oauth2server.invalidateAll(userUID);
//       } else {
//         await oauth2server.invalidateOne(userUID);
//       }
//     } else return false;

//     if (req.res) {
//       req.res.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
//       req.res.clearCookie(USERUID_COOKIE, { path: COOKIE_PATH });
//     }

//     return true;
//   } catch (error) {
//     return error;
//   }
// };
