import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseService } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseService.createCourse(req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully created course',
    data: result,
  });
});

const getCourse = catchAsync(async (req, res) => {
  const result = await CourseService.getCourse(req.query);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Course are retrieve successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.getSingleCourse(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Course is retrieve successful',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.updateCourse(id, req.body);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'course is update successful',
    data: result,
  });
});

const assignCourseFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculties } = req.body;
  const result = await CourseService.assignCourseFacultyInDB(id, faculties);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'course faculties assign successful',
    data: result,
  });
});

const getCourseWithFaculties = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseService.getCourseFacultiesFromDB(courseId);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'course faculties assign successful',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CourseService.deleteCourse(id);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'course is delete successful',
  });
});

const removeFaculties = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculties } = req.body;
  const result = await CourseService.removeFacultiesFromDB(id, faculties);
  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'faculties deleted successful',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignCourseFaculty,
  getCourseWithFaculties,
  removeFaculties,
};
