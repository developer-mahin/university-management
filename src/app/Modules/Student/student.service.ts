import createError from 'http-errors';
import { TStudent } from './student.interface';
import Student from './student.model';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from '../User/user.model';

const getALlStudentFromDB = async (query: Record<string, unknown>) => {
  const studentSearchableField = ['email', 'name.firstName', 'presentAddress'];

  const queryObj = { ...query };

  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: studentSearchableField.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  const excludesField = ['searchTerm', 'sort', 'limit'];
  excludesField.forEach((el) => delete queryObj[el]);

  const filterQuery = searchQuery
    .find(queryObj)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    })
    .populate('user');

  let sort = '-createdAt';
  if (query.sort) {
    sort = query.sort as string;
  }
  const sortQuery = filterQuery.sort(sort);

  let limit = 1;
  if (query.limit) {
    limit = query.limit as number;
  }

  const limitQuery = await sortQuery.limit(limit);
  return limitQuery;
};

const getSingleStudentFromDB = async (id: string) => {
  const isExist = await Student.exists({ id });
  if (!isExist) {
    throw createError(404, 'student not found');
  }

  const result = await Student.findOne({ id: id })
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: [
        {
          path: 'academicFaculty',
        },
      ],
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const isExist = await Student.exists({ id });
  if (!isExist) {
    throw createError(httpStatus.NOT_FOUND, 'user not found!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw createError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw createError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }
    session.commitTransaction();
    session.endSession();
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw createError(httpStatus.BAD_REQUEST, 'Failed to delete');
  }
};

const updateStudent = async (id: string, payload: Partial<TStudent>) => {
  const isExist = await Student.exists({ id });
  if (!isExist) {
    throw createError(httpStatus.NOT_FOUND, 'user not found!');
  }

  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
  });
  return result;
};

export const studentServicer = {
  getALlStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudent,
};
