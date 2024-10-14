import { Router, Request, Response } from 'express';
import { AuthConfig } from '@/app-constants';
import { ApiRoutesConfig, VerifyUserEmail } from '@ecom-mern/shared';
import { validateAuthHeader } from '@/utils';
import AuthService from './service';
import * as AuthTypes from './types';

const authRouter = Router();
const authService = new AuthService();

/* Check if user is logged in */
authRouter.get(
  `/${ApiRoutesConfig.auth.subRoutes.checkLogin}`,
  (req: Request, res: Response) => {
    return authService.checkLogin(req, res);
  }
);

/* Login user */
authRouter.post(
  `/${ApiRoutesConfig.auth.subRoutes.login}`,
  async (
    req: Request<object, object, AuthTypes.UserLoginBody>,
    res: Response
  ) => {
    const { email, password } = req.body;
    return await authService.loginUser(res, email, password);
  }
);

/* Issue new JWT */
authRouter.post(
  `/${ApiRoutesConfig.auth.subRoutes.refreshToken}`,
  (req: Request, res: Response) => {
    const token = req.cookies?.[AuthConfig.cookies_name.refresh];
    return authService.issueNewJWT(res, token);
  }
);

/* Logout user */
authRouter.delete(
  `/${ApiRoutesConfig.auth.subRoutes.logout}`,
  validateAuthHeader,
  (req: Request, res: Response) => {
    return authService.logoutUser(res);
  }
);

/* Verify user email on signup */
authRouter.post(
  `/${ApiRoutesConfig.auth.subRoutes.verifyEmail}`,
  (req: Request, res: Response) => {
    const token = req.cookies?.[AuthConfig.cookies_name.refresh];
    return authService.issueNewJWT(res, token);
  }
);

/* Share password reset link on user email if it exists */
authRouter.post(
  `/${ApiRoutesConfig.auth.subRoutes.findAccount}`,
  async (req: Request<object, object, VerifyUserEmail>, res: Response) => {
    const userEmail = req.body.email;
    return await authService.initiateUserPasswordReset(res, userEmail);
  }
);

export { authRouter };
