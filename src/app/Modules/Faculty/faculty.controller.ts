import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { facultyServices } from './faculty.service';
import AppError from '../../utils/AppError';

const getAllFaculties = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await facultyServices.getAllFaculties(query);
  
  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully get all faculties',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError(httpStatus.NOT_FOUND, 'user id not founded');
  }

  const result = await facultyServices.getSingleFaculty(id);
  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully get all faculties',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError(httpStatus.NOT_FOUND, 'user id not founded');
  }

  const result = await facultyServices.updateFaculty(id, req.body);
  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully get all faculties',
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError(httpStatus.NOT_FOUND, 'user id not founded');
  }

  await facultyServices.deleteFaculty(id);
  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: 'successfully delete faculty',
  });
});

export const facultyController = {
  getAllFaculties,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
