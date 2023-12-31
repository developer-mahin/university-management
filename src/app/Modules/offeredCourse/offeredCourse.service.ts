import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import AcademicDepartment from '../AcademicDepartment/academicDepartment.model';
import AcademicFaculty from '../AcademicFaculty/academicFaculty.model';
import { Course } from '../Course/course.model';
import Faculty from '../Faculty/faculty.model';
import SemesterRegistration from '../semisterRegistration/semesterRegistration.model';
import { TOfferCourse } from './offeredCourse.interface';
import OfferCourse from './offeredCourse.model';
import { handleTimeConflict } from './offeredCourse.utlis';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';

const createOfferedCourseIntoDB = async (payload: TOfferCourse) => {
  const {
    semesterRegister,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  const isSemesterRegisterExist =
    await SemesterRegistration.findById(semesterRegister);
  if (!isSemesterRegisterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration not found!',
    );
  }

  const academicSemester = isSemesterRegisterExist.academicSemester;

  const isAcademicFacultyExist =
    await AcademicFaculty.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
  }

  const isAcademicDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!isAcademicDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }

  const isCourseExist = await Course.findById(course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  const isDepartmentBelongsToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  });

  if (!isDepartmentBelongsToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`,
    );
  }

  const isSameOfferCourseWithSameRegistrationAndSameCourseIsAlreadyExist =
    await OfferCourse.findOne({
      semesterRegister,
      course,
      section,
    });

  if (isSameOfferCourseWithSameRegistrationAndSameCourseIsAlreadyExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offer course with same course and semester is already exist!',
    );
  }

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  const existingSchedule = await OfferCourse.find({
    semesterRegister,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  if (handleTimeConflict(existingSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This faculty is not available at that time! Choose another time or day',
    );
  }

  const result = await OfferCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.queryModel;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseInToDB = async (
  id: string,
  payload: Pick<TOfferCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the faculty exists
   * Step 3: check if the semester registration status is upcoming
   * Step 4: check if the faculty is available at that time. If not then throw error
   * Step 5: update the offered course
   */

  const isExistOfferedCourse = await OfferCourse.findById(id);
  if (!isExistOfferedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found');
  }

  const isExistFaculty = await Faculty.findById(faculty);
  if (!isExistFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  const semesterRegister = isExistOfferedCourse.semesterRegister;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegister);

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
    );
  }

  const existingSchedule = await OfferCourse.find({
    semesterRegister,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  if (handleTimeConflict(existingSchedule, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This faculty is not available at that time! Choose another time or day',
    );
  }

  const result = await OfferCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const semesterRegister = isOfferedCourseExists.semesterRegister;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegister).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferCourse.findByIdAndDelete(id);

  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInToDB,
  deleteOfferedCourseFromDB,
};
