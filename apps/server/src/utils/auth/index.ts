import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRole } from 'models/User';
import { AuthConfig, ENV_VARS } from 'app-constants';
import { printError } from 'utils';

export interface GenerateTokenPayload {
  _id: string;
  email: string;
  role: UserRole;
}

export interface DecodedTokenInfo extends GenerateTokenPayload {
  iat: number;
  exp: number;
}

const jwtSecretKey = ENV_VARS.auth.jwt_secret;
const refreshTokenKey = ENV_VARS.auth.refresh_token_secret;

export function generateJWT(
  payload: GenerateTokenPayload,
  isRefeshToken?: boolean
): string {
  const expiry = isRefeshToken
    ? AuthConfig.cookies_expiry.refresh
    : AuthConfig.cookies_expiry.jwt;

  const token = jwt.sign(
    { ...payload, iat: Date.now() },
    isRefeshToken ? refreshTokenKey : jwtSecretKey,
    {
      expiresIn: expiry,
    }
  );
  return token;
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    printError(err);
  }
  return '';
}
