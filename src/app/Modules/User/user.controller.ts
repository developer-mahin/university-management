import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password, student: studentData } = req.body;
    if (!studentData || !password) {
      throw createError(500, 'data not found');
    }

    const result = await userServices.saveStudentsInDB(password, studentData);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: 'successfully created the user',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createStudents,
};
