import mongoose from 'mongoose';
import config from '../../config';
import AcademicSemester from '../AcademicSemester/academicSemester.model';
import { TStudent } from '../Student/student.interface';
import Student from '../Student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { TFaculty } from '../Faculty/faculty.interface';
import Faculty from '../Faculty/faculty.model';
import AppError from '../../utils/AppError';
import AcademicDepartment from '../AcademicDepartment/academicDepartment.model';
import { TAdmin } from '../Admin/admin.interface';
import Admin from '../Admin/admin.model';
import { sendImageIntoCloudinary } from '../../utils/sendImageIntoCloudinary';

const saveStudentsInDB = async (password: string, payload: TStudent) => {
  const newUser: Partial<TUser> = {};
  // set password
  newUser.password = password || (config.defaultPassword as string);
  newUser.role = 'student';
  newUser.email = payload.email;

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(404, "admissionSemester didn't found");
  }

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

    sendImageIntoCloudinary();

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

const createFaculty = async (password: string, payload: TFaculty) => {
  const facultyData: Partial<TUser> = {};
  facultyData.role = 'faculty';
  facultyData.password = password || config.defaultPassword;
  facultyData.email = payload.email;

  const session = await mongoose.startSession();
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(404, "Academic Department didn't found");
  }

  try {
    session.startTransaction();
    facultyData.id = await generateFacultyId();

    const createdUser = await User.create([facultyData], { session });

    if (!createdUser.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "user does'nt created something went wrong!",
      );
    }

    payload.id = createdUser[0].id;
    payload.user = createdUser[0]._id;
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty) {
      throw new AppError(400, "Faculty didn't created !");
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(404, error.message);
  }
};

const createAdmin = async (password: string, payload: TAdmin) => {
  const adminData: Partial<TUser> = {};
  adminData.password = password || config.defaultPassword;
  adminData.role = 'admin';
  adminData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const lastId = await generateAdminId();
    if (!lastId) {
      throw new AppError(404, 'Admin id not found');
    }
    adminData.id = lastId;
    const createNewUser = await User.create([adminData], { session });

    if (!createNewUser.length) {
      throw new AppError(400, "user doesn't created");
    }

    payload.id = createNewUser[0].id;
    payload.user = createNewUser[0]._id;

    const createNewAdmin = await Admin.create([payload], { session });
    if (!createNewAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, "admin doesn't created!");
    }

    await session.commitTransaction();
    await session.endSession();

    return createNewAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, error.message);
  }
};

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId });
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId });
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId });
  }

  return result;
};

const changeStatus = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const userServices = {
  saveStudentsInDB,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
