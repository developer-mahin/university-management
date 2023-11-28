/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.status || 500;
  const message = error.message || 'something went wrong';

  return res.status(statusCode).json({
    success: false,
    message: message,
    error,
  });
};

export default globalErrorHandler;
