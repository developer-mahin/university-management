import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../Modules/User/user.interface';
import User from '../Modules/User/user.model';
import config from '../config';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { verifyToken } from '../utils/verifyToken';

export const auth = (...requestedRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    const decoded = verifyToken(
      token,
      config.access_token as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    if (requestedRole && !requestedRole.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    const user = await User.isUserExist(userId);
    if (!user) {
      throw new AppError(httpStatus.FORBIDDEN, 'User not found');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are deleted user');
    }

    if (
      user.passwordUpdatedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordUpdatedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    if (user.status === 'blocked') {
      throw new AppError(httpStatus.CONFLICT, 'You are a blocked user');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
