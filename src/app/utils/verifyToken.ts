import httpStatus from 'http-status';
import AppError from './AppError';
import jwt from 'jsonwebtoken';

export const verifyToken = (token: string, accessToken: string) => {
  try {
    return jwt.verify(token, accessToken);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
};
