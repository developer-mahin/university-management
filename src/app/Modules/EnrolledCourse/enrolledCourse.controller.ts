import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { enrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.enrolledCourse(userId, req.body);

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: 'successfully course enrolled ',
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await enrolledCourseServices.updateEnrolledCourseMarks(
    userId,
    req.body,
  );

  sendResponse(res, {
    status: httpStatus.CREATED,
    success: true,
    message: 'successfully course updated ',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
};
