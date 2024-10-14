import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@/models/User';
import { AuthConfig, ENV_VARS } from '@/app-constants';
import { DecodedTokenInfo } from '@/routes/auth/types';
import winstonLogger from '@/winston-logger';
import { generateJWT } from '../auth';

/**
 * Prev was with any instead of using object
 */

export function validateAuthHeader(
  req: Request<object, object, object, object>,
  res: Response,
  next: NextFunction
) {
  /* Check presence of jwt and refresh-token */
  // const token = req.headers.authorization?.split(' ')?.[1];
  let token: string | undefined = req.cookies?.[AuthConfig.cookies_name.jwt];
  let refreshToken = req.cookies?.[AuthConfig.cookies_name.refresh];

  if (!token) {
    const errorMsg = 'Unauthorized request';
    winstonLogger.error(errorMsg);
    return res.status(401).send(errorMsg).end();
  }

  if (!refreshToken) {
    const expiryMsg = 'Expired Session. Please login again';
    winstonLogger.warn(expiryMsg);
    return res.status(406).send(expiryMsg).end();
  }

  const jwtSecretKey = ENV_VARS.auth.jwt_secret;
  const refreshTokenKey = ENV_VARS.auth.refresh_token_secret;

  /* Renew jwt if needed */
  const {
    exp: jwtExpiry,
    iat,
    ...userInfo
  } = jwt.verify(token, jwtSecretKey) as DecodedTokenInfo;
  if (jwtExpiry - Date.now() <= AuthConfig.cookies_expiry.renew_threshold) {
    token = generateJWT(userInfo);
  }

  /* Renew refresh-token if needed */
  const { exp: refreshTokenExpiry } = jwt.verify(
    refreshToken,
    refreshTokenKey
  ) as DecodedTokenInfo;
  if (
    refreshTokenExpiry - Date.now() <=
    AuthConfig.cookies_expiry.renew_threshold
  ) {
    refreshToken = generateJWT(userInfo, true);
  }

  res
    .cookie(AuthConfig.cookies_name.jwt, token, {
      maxAge: AuthConfig.cookies_expiry.jwt
    })
    .cookie(AuthConfig.cookies_name.refresh, refreshToken, {
      maxAge: AuthConfig.cookies_expiry.refresh
    });
  res.locals.user = userInfo;
  next();
}

export function authenticateAdmin(
  req: Request<object, object, object, object>,
  res: Response,
  next: NextFunction
) {
  if (res.locals?.user?.role === UserRole.Admin) {
    next();
  } else {
    const errMsg = 'FORBIDDEN from accessing Admin route';
    winstonLogger.error(errMsg);
    res.status(403).send(errMsg).end();
  }
}

export function checkTokenMismatchInReqParams(
  req: Request<object, object, object, object>,
  res: Response,
  next: NextFunction
) {
  if (res.locals?.user?._id !== req.params.id) {
    return res.status(406).send('Token Mismatch').end();
  }
  next();
}

export function checkTokenMismatchInReqQuery(
  req: Request<object, object, object, object>,
  res: Response,
  next: NextFunction
) {
  if (res.locals?.user?._id !== req.query.customer_id) {
    return res.status(406).send('Token Mismatch').end();
  }
  next();
}
