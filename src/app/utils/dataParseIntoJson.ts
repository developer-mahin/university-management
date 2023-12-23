import { NextFunction, Request, Response } from 'express';

export const dataParseIntoJson = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body = req.body.data;
  next();
};
