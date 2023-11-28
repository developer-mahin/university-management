import { NextFunction, Request, Response } from 'express';
import { studentServicer } from './student.service';
import createError from 'http-errors';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getALlStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await studentServicer.getALlStudentFromDB();

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: 'successfully get all user',
      data: result,
    })

  } catch (error) {
    next(error);
  }
};
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await studentServicer.getSingleStudentFromDB(studentId);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: 'successfully get a user',
      data: result,
    })

  } catch (error) {
    next(error);
  }
};
const deleteUserFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      throw createError(404, 'id not found');
    }
    await studentServicer.deleteStudentFromDB(studentId);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: 'successfully delete a user',
      data: null,
    })
  } catch (error) {
    next(error);
  }
};

export const studentController = {
  getALlStudent,
  getSingleStudent,
  deleteUserFromDB,
};
