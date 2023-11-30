import createError from 'http-errors';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { studentServicer } from './student.service';
import catchAsync from '../../utils/catchAsync';

const getALlStudent = catchAsync(async (req, res) => {
  const result = await studentServicer.getALlStudentFromDB();

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get all user',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await studentServicer.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get a user',
    data: result,
  });
});

const deleteUserFromDB = catchAsync(async (req, res) => {
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
  });
});

export const studentController = {
  getALlStudent,
  getSingleStudent,
  deleteUserFromDB,
};
