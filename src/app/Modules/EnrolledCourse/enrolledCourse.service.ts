import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../utils/AppError';
import Student from '../Student/student.model';
import OfferCourse from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import SemesterRegistration from '../semisterRegistration/semesterRegistration.model';
import { Course } from '../Course/course.model';
import Faculty from '../Faculty/faculty.model';
import { calculateMarksAndGrade } from './enrolledCourse.utils';

const enrolledCourse = async (userId: string, payload: TEnrolledCourse) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExist = await OfferCourse.findById(offeredCourse);

  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found');
  }

  if (isOfferedCourseExist.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full !');
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }

  const isUserAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegister: isOfferedCourseExist.semesterRegister,
    offeredCourse,
    student: student._id,
  });

  if (isUserAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !');
  }
  const course = await Course.findById(isOfferedCourseExist.course);
  const currentCredit = course?.credit;

  const maxCredit = await SemesterRegistration.findById(
    isOfferedCourseExist.semesterRegister,
  ).select('maxCredit');

  const totalCreditInEnrollCourse = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegister: isOfferedCourseExist?.semesterRegister,
        student: student._id,
      },
    },

    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },

    {
      $unwind: '$enrolledCourseData',
    },

    {
      $group: {
        _id: null,
        totalCreditEnrollCredits: { $sum: '$enrolledCourseData.credit' },
      },
    },

    {
      $project: {
        _id: 0,
        totalCreditEnrollCredits: 1,
      },
    },
  ]);

  const totalCredit =
    totalCreditInEnrollCourse.length > 0
      ? totalCreditInEnrollCourse[0].totalCreditEnrollCredits
      : 0;

  if (totalCredit && maxCredit && totalCredit + currentCredit > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exceeded maximum number of credits !',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      semesterRegister,
      academicDepartment,
      academicSemester,
      academicFaculty,
      course,
      faculty,
    } = isOfferedCourseExist;

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegister,
          academicSemester,
          academicFaculty,
          academicDepartment,
          offeredCourse,
          course,
          student: student._id,
          faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    const maxCapacity = isOfferedCourseExist.maxCapacity;
    if (maxCapacity < 0) {
      throw new AppError(httpStatus.CONFLICT, 'Room is full');
    }
    await OfferCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateEnrolledCourseMarks = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegister, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegisterExist =
    await SemesterRegistration.findById(semesterRegister);
  if (!isSemesterRegisterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'semester registration is not found',
    );
  }

  const isOfferedCourseExist = await OfferCourse.findById(offeredCourse);
  if (!isOfferedCourseExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'semester registration is not found',
    );
  }

  const isStudentExist = await Student.findById(student);
  if (!isStudentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'semester registration is not found',
    );
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'faculty is not found');
  }

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegister,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongsToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'you are forbidden');
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const totalMarks =
      Math.ceil(courseMarks.classTest1 * 0.1) +
      Math.ceil(courseMarks.midTerm * 0.3) +
      Math.ceil(courseMarks.classTest2 * 0.1) +
      Math.ceil(courseMarks.finalTerm * 0.5);

    const calculatedMarks = calculateMarksAndGrade(totalMarks);

    modifiedData.grade = calculatedMarks.grade;
    modifiedData.gradePoints = calculatedMarks.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

export const enrolledCourseServices = {
  enrolledCourse,
  updateEnrolledCourseMarks,
};
