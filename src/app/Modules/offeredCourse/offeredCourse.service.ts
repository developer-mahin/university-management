import httpStatus from 'http-status';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import AppError from '../../utils/AppError';
import AcademicDepartment from '../AcademicDepartment/academicDepartment.model';
import AcademicFaculty from '../AcademicFaculty/academicFaculty.model';
import { Course } from '../Course/course.model';
import Faculty from '../Faculty/faculty.model';
import Student from '../Student/student.model';
import SemesterRegistration from '../semisterRegistration/semesterRegistration.model';
import { TOfferCourse } from './offeredCourse.interface';
import OfferedCourse from './offeredCourse.model';
import { handleTimeConflict } from './offeredCourse.utlis';

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
    await OfferedCourse.findOne({
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

  const existingSchedule = await OfferedCourse.find({
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

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.queryModel;
  const meta = await offeredCourseQuery.countTotal();
  
  return {
    meta,
    result,
  };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const getMyOfferedCourseFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await Student.findOne({ id: userId });
  // Check if user exist
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }

  // check ongoing semester
  const currentOngoingSemester = await SemesterRegistration.findOne({
    status: 'ONGOING',
  });

  if (!currentOngoingSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found',
    );
  }

  const aggregateQuery = [
    {
      $match: {
        semesterRegister: currentOngoingSemester._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },

    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },

    {
      $unwind: '$course',
    },

    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingSemester: currentOngoingSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$semesterRegister', '$$currentOngoingSemester'],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourse',
      },
    },

    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$student', '$$currentStudent'] },
                  { $eq: ['$isCompleted', true] },
                ],
              },
            },
          },
        ],
        as: 'completedCourse',
      },
    },

    {
      $addFields: {
        isCompletedCourseIds: {
          $map: {
            input: '$completedCourse',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },

    {
      $addFields: {
        isPreRequisiteFullFilled: {
          $or: [
            {
              $eq: ['$course.preRequisiteCourses', []],
            },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$isCompletedCourseIds',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourse',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },

    {
      $match: {
        isAlreadyEnrolled: { $ne: true },
        isPreRequisiteFullFilled: { $ne: false },
      },
    },
  ];

  const paginateQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourse.aggregate([
    ...aggregateQuery,
    ...paginateQuery,
  ]);

  const total = (await OfferedCourse.aggregate(aggregateQuery)).length;
  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
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

  const isExistOfferedCourse = await OfferedCourse.findById(id);
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

  const existingSchedule = await OfferedCourse.find({
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

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
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
  const isOfferedCourseExists = await OfferedCourse.findById(id);

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

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseInToDB,
  deleteOfferedCourseFromDB,
  getMyOfferedCourseFromDB,
};
