import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import User from '../User/user.model';
import { TAuthentication } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

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

  const token = jwt.sign(userDate, config.access_token as string, {
    expiresIn: '10d',
  });

  return {
    token,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

export const authServices = {
  loginUserInToDB,
};
