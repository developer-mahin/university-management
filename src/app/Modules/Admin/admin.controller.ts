import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminServices } from './admin.service';
import AppError from '../../utils/AppError';

const getAllAdmins = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await adminServices.getAllAdmins(query);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get all admins',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Id not found');
  }

  const result = await adminServices.getSingleAdmin(id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get an admin',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Id not found');
  }

  const result = await adminServices.updateAdmin(id, updatedData);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully update an admin',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Id not found');
  }

  await adminServices.deleteAdmin(id);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully delete an admin',
  });
});

export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
