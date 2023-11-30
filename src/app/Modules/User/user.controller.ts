import createError from 'http-errors';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudents = catchAsync(async (req, res) => {
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
});

export const userController = {
  createStudents,
};
