import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemester from '../AcademicSemester/academicSemester.model';
import { TStudent } from '../Student/student.interface';
import Student from '../Student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import { generateStudentId } from './user.utils';
import createError from 'http-errors';
import httpStatus from 'http-status';

const saveStudentsInDB = async (password: string, payload: TStudent) => {
  const newUser: Partial<TUser> = {};
  // set password
  newUser.password = password || (config.defaultPassword as string);

  newUser.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    if (admissionSemester && Object.keys(admissionSemester).length) {
      newUser.id = await generateStudentId(admissionSemester);
    } else {
      throw createError(httpStatus.NOT_FOUND, 'Admission Semester not found');
    }
    // transaction-1
    const result = await User.create([newUser], { session });

    if (!result.length) {
      throw createError(
        httpStatus.BAD_REQUEST,
        "user does'nt created something went wrong!",
      );
    }

    payload.id = result[0].id;
    payload.user = result[0]._id;
    // transaction-2
    const newStudent = await Student.create([payload], { session });

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw createError(httpStatus.BAD_REQUEST, 'failed create user');
  }
};

export const userServices = {
  saveStudentsInDB,
};
