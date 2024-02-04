import createError from 'http-errors';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { studentServicer } from './student.service';
import catchAsync from '../../utils/catchAsync';

const getALlStudent = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await studentServicer.getALlStudentFromDB(query);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get all user',
    meta: result.meta,
    data: result.result,
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

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    throw createError(404, 'Id not found');
  }
  await studentServicer.deleteStudentFromDB(studentId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully delete a user',
    data: null,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) {
    throw createError(404, 'Id not found');
  }
  const result = await studentServicer.updateStudent(studentId, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully delete a user',
    data: result,
  });
});

export const studentController = {
  getALlStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
