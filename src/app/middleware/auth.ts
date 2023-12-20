import httpStatus from 'http-status';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../Modules/User/user.interface';

export const auth = (...requestedRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    jwt.verify(token, config.access_token as string, function (error, decoded) {
      if (error) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
      }

      const role = (decoded as JwtPayload).role;
      if (requestedRole && !requestedRole.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
      }
      
      req.user = decoded as JwtPayload;
      next();
    });
  });
};
