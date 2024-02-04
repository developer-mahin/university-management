import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicDepartmentService } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result = await academicDepartmentService.createAcademicDepartment(
    req.body,
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully created academic department',
    data: result,
  });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const result = await academicDepartmentService.getAllAcademicDepartment(
    req.query,
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get all academic department',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await academicDepartmentService.getSingleAcademicDepartment(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get a single academic department',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicDepartmentService.updateAcademicDepartment(
    id,
    req.body,
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully update academic department',
    data: result,
  });
});

export const academicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
