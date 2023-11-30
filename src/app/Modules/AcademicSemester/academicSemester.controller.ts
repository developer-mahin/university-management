import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterService } from './academicSemester.service';


const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterService.createAcademicSemester(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully created academic semester',
    data: result,
  });
});

const getAllSemester = catchAsync(async (req, res) => {
  const result = await academicSemesterService.getAllSemester();

  sendResponse(res, {
    status: httpStatus.FOUND,
    success: true,
    message: 'successfully get all semester',
    data: result,
  });
});

const getSingleSemester = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicSemesterService.getSingleSemester(id);

  sendResponse(res, {
    status: httpStatus.FOUND,
    success: true,
    message: 'successfully get all semester',
    data: result,
  });
});

const updateSemester = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await academicSemesterService.updateSemester(id, req.body);

  sendResponse(res, {
    status: httpStatus.FOUND,
    success: true,
    message: 'successfully get all semester',
    data: result,
  });
});

export const academicSemesterController = {
  createAcademicSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester,
};
