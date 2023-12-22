import createError from 'http-errors';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/AppError';

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

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  if (!password || !facultyData) {
    throw new AppError(404, 'Data not found');
  }

  const result = await userServices.createFaculty(password, facultyData);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully created the faculty',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;
  if (!password || !adminData) {
    throw new AppError(404, 'admin data not found');
  }

  const result = await userServices.createAdmin(password, adminData);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully created the admin',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await userServices.getMe(userId, role);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully get my profile',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.changeStatus(id, req.body);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully update status',
    data: result,
  });
});

export const userController = {
  createStudents,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
