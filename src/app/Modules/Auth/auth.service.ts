import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../utils/AppError';
import User from '../User/user.model';
import { TAuthentication } from './auth.interface';
import { createToken } from './auth.utils';
import jwt from 'jsonwebtoken';

const loginUserInToDB = async (payload: TAuthentication) => {
  const { id, password } = payload;

  const user = await User.isUserExist(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const checkUserStatus = user?.status;
  if (checkUserStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (!(await User.isMatchedPassword(password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  const userDate = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    userDate,
    config.access_token as string,
    config.access_expires_in as string,
  );

  const refreshToken = createToken(
    userDate,
    config.refresh_token as string,
    config.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { newPassword: string; oldPassword: string },
) => {
  const user = await User.isUserExist(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const checkIsDeleted = user?.isDeleted;
  if (checkIsDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'You are deleted user');
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'You are a blocked user');
  }

  // compare old password
  if (!(await User.isMatchedPassword(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'password not matched');
  }

  // hash new password
  const hashNewPassword = await bcrypt.hash(payload?.newPassword, 10);
  await User.findOneAndUpdate(
    { id: userData?.userId, role: userData?.role },
    {
      password: hashNewPassword,
      needsPasswordChange: false,
      passwordUpdatedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }

  const decoded = jwt.verify(
    token,
    config.refresh_token as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;
  const user = await User.isUserExist(userId);
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'User not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are deleted user');
  }

  if (
    user.passwordUpdatedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordUpdatedAt, iat as number)
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.CONFLICT, 'You are a blocked user');
  }

  const userData = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = createToken(
    userData,
    config.access_token as string,
    config.access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const authServices = {
  loginUserInToDB,
  changePassword,
  refreshToken,
};
