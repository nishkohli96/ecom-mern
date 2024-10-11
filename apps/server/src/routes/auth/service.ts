import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ApiRoutesConfig } from '@ecom-mern/shared';
import { UserModel, TokenModel } from '@/models';
import { generateJWT, printError, errorLogger } from '@/utils';
import { AuthConfig, ENV_VARS } from '@/app-constants';
import * as AuthTypes from './types';

class AuthService {
  checkLogin(req: Request, res: Response) {
    const token = req.cookies?.[AuthConfig.cookies_name.jwt];
    const refreshToken = req.cookies?.[AuthConfig.cookies_name.refresh];
    if (!token || !refreshToken) {
      res.status(401).send('Not logged in').end();
    }
    res.status(200).send('Logged in').end();
  }

  async loginUser(res: Response, email: string, password: string) {
    try {
      /* Check if user exists */
      const user = await UserModel.findOne({ email }).select([
        '_id',
        'name',
        'email',
        'phone',
        'avatar',
        'password',
        'role',
      ]);
      if (!user) return res.status(401).send('Account does not exist');

      /* Check if user password is correct */
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Incorrect password. Please try again.');
      }

      const user_id = user._id.toString();
      const token = generateJWT({
        _id: user_id,
        email,
        role: user.role,
      });
      const refreshToken = generateJWT(
        {
          _id: user_id,
          email,
          role: user.role,
        },
        true
      );

      res
        .status(200)
        .header({
          'Access-Control-Allow-Credentials': 'true',
        })
        .cookie(AuthConfig.cookies_name.refresh, refreshToken, {
          /* cannot be read by document.cookie */
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          maxAge: AuthConfig.cookies_expiry.refresh,
        })
        .cookie(AuthConfig.cookies_name.jwt, token, {
          httpOnly: true,
          secure: true,
          maxAge: AuthConfig.cookies_expiry.jwt,
        })
        .send({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone,
        });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
    res.end();
  }

  issueNewJWT(res: Response, refreshToken: string | undefined) {
    const errorMsg = 'Refresh Token missing or invalid';
    const errCode = 406;
    if (refreshToken) {
      try {
        const refreshTokenKey = ENV_VARS.auth.refresh_token_secret;
        const decoded = jwt.verify(
          refreshToken,
          refreshTokenKey
        ) as AuthTypes.DecodedTokenInfo;
        const { exp, iat, ...userData } = decoded;

        const newToken = generateJWT({
          _id: userData._id,
          email: userData.email,
          role: userData.role,
        });

        res
          .status(200)
          .cookie(AuthConfig.cookies_name.jwt, newToken, {
            maxAge: AuthConfig.cookies_expiry.jwt,
          })
          .send({
            _id: userData._id,
          });
      } catch (err) {
        printError(err);
        res
          .status(errCode)
          .cookie(AuthConfig.cookies_name.jwt, '', { maxAge: 0 })
          .send(errorMsg);
      }
    } else {
      res
        .status(errCode)
        .cookie(AuthConfig.cookies_name.jwt, '', { maxAge: 0 })
        .send(errorMsg);
    }
  }

  logoutUser(res: Response) {
    res
      .status(200)
      .cookie(AuthConfig.cookies_name.refresh, '', { maxAge: 0 })
      .cookie(AuthConfig.cookies_name.jwt, '', { maxAge: 0 })
      .send('User Logged out');
  }

  async initiateUserPasswordReset(res: Response, userEmail: string) {
    try {
      const user = await UserModel.findOne({ email: userEmail });
      if (!user) {
        return res
          .status(404)
          .send('User info incorrect or does not exist')
          .end();
      }
      const token = await TokenModel.findOne({ userId: user._id });
      if (token) {
        await token.deleteOne();
      }
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hash = await bcrypt.hash(resetToken, 10);

      await new TokenModel({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      }).save();

      const link = `${ENV_VARS.client_url}/${ApiRoutesConfig.auth.pathName}/${ApiRoutesConfig.auth.subRoutes.resetPassword}?token=${resetToken}&id=${user._id}`;
      console.log('link: ', link);

      return res.status(200).send('Password reset link shared on email').end();
    } catch (err: any) {
      errorLogger(res, err);
    }
  }
}

export default AuthService;
