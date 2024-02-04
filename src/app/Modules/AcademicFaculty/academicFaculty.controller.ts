import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicFacultyService } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await academicFacultyService.createAcademicFaculty(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully created academic faculty',
    data: result,
  });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await academicFacultyService.getAcademicFaculties(req.query);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get all academic faculties',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleAcademicFaculties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicFacultyService.getSingleAcademicFaculty(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully get academic faculty',
    data: result,
  });
});

const updateAcademicFaculties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await academicFacultyService.updateAcademicFaculty(
    id,
    req.body,
  );
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully update academic faculty',
    data: result,
  });
});

export const academicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculties,
  updateAcademicFaculties,
};
