import { Request, Response, Router } from 'express';
import {
  authenticateAdmin,
  validateAuthHeader,
  checkTokenMismatchInReqParams
} from '@/utils';
import {
  ApiRoutesConfig,
  ConfirmPasswordType,
  PasswordResetQueryParams,
  SetDefaultAddress,
  UserPasswordChange,
  UserAddress
} from '@ecom-mern/shared';
import UserService from './service';
import * as UserTypes from './types';

const userRouter = Router();
const userService = new UserService();

/* Get all users */
userRouter.get(
  '/',
  validateAuthHeader,
  authenticateAdmin,
  async function (_, res: Response) {
    return userService.fetchUsers(res);
  }
);

/* Get basic user details */
userRouter.get(
  '/:id',
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (
    req: Request<UserTypes.UserById, object, object, object>,
    res: Response
  ) {
    const userId = req.params.id;
    return userService.getUserById(res, userId);
  }
);

/* Register a new user */
userRouter.post(
  '/add',
  async function (
    req: Request<object, object, UserTypes.AddUser>,
    res: Response
  ) {
    const userData = req.body;
    return userService.addUser(res, userData);
  }
);

/* Change user password */
userRouter.put(
  `/${ApiRoutesConfig.user.subRoutes.changePswd}`,
  validateAuthHeader,
  async function (
    req: Request<object, object, UserPasswordChange>,
    res: Response
  ) {
    const userData = req.body;
    return userService.changePassword(res, userData);
  }
);

/* Reset forgotten password */
userRouter.put(
  `/${ApiRoutesConfig.user.subRoutes.resetPswd}`,
  async function (
    req: Request<object, object, ConfirmPasswordType, PasswordResetQueryParams>,
    res: Response
  ) {
    const newUserPassword = req.body;
    const userMetaData = req.query;
    return userService.resetPassword(res, userMetaData, newUserPassword);
  }
);

/* Update user details */
userRouter.put(
  `/${ApiRoutesConfig.user.subRoutes.update}/:id`,
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (
    req: Request<UserTypes.UserById, object, UserTypes.UpdateUser>,
    res: Response
  ) {
    const userId = req.params.id;
    const userData = req.body;
    return userService.updateUser(res, userId, userData);
  }
);

/* Delete user from db */
userRouter.delete(
  '/:id',
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (req: Request<UserTypes.UserById>, res: Response) {
    const userId = req.params.id;
    return userService.deleteUserById(res, userId);
  }
);

/* Get user addresses */
userRouter.get(
  `/:id/${ApiRoutesConfig.user.subRoutes.address}`,
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (req: Request<UserTypes.UserById>, res: Response) {
    const userId = req.params.id;
    return userService.getUserAddressList(res, userId);
  }
);

/* Add user address */
userRouter.post(
  `/:id/${ApiRoutesConfig.user.subRoutes.address}`,
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (
    req: Request<UserTypes.UserById, object, UserAddress>,
    res: Response
  ) {
    const userId = req.params.id;
    const addressDetails = req.body;
    return userService.addToUserAddressList(res, userId, addressDetails);
  }
);

/* Update user address */
userRouter.put(
  `/:id/${ApiRoutesConfig.user.subRoutes.address}`,
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (
    req: Request<UserTypes.UserById, object, UserTypes.UserAddressDocument>,
    res: Response
  ) {
    const userId = req.params.id;
    const updatedAddress = req.body;
    return userService.updateUserAddress(res, userId, updatedAddress);
  }
);

/* Change default address */
userRouter.put(
  `/:id/${ApiRoutesConfig.user.subRoutes.defaultAddr}`,
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (
    req: Request<UserTypes.UserById, object, SetDefaultAddress>,
    res: Response
  ) {
    const userId = req.params.id;
    const defaultAddressId = req.body.address_id;
    return userService.setDefaultUserAddress(res, userId, defaultAddressId);
  }
);

/* Delete user address */
userRouter.delete(
  `/:id/${ApiRoutesConfig.user.subRoutes.address}`,
  validateAuthHeader,
  checkTokenMismatchInReqParams,
  async function (
    req: Request<UserTypes.UserById, object, SetDefaultAddress>,
    res: Response
  ) {
    const userId = req.params.id;
    const addressId = req.body.address_id;
    return userService.deleteUserAddress(res, userId, addressId);
  }
);

export { userRouter };
