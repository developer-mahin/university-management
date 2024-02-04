import httpStatus from 'http-status';
import AppError from '../../utils/AppError';
import Faculty from './faculty.model';
import mongoose from 'mongoose';
import User from '../User/user.model';
import { TFaculty } from './faculty.interface';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';

const getAllFaculties = async (query: Record<string, unknown>) => {
  const searchableField = ['email', 'name.firstName', 'presentAddress'];

  const faculTyQuery = new QueryBuilder(
    Faculty.find({})
      .populate('user')
      .populate('academicDepartment academicFaculty'),
    query,
  )
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await faculTyQuery.queryModel;
  const meta = await faculTyQuery.countTotal();

  return { meta, result };
};

const getSingleFaculty = async (id: string) => {
  const result = await Faculty.findOne({ id })
    .populate('user')
    .populate('academicDepartment academicFaculty');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found with this id');
  }

  return result;
};

const updateFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const isExist = await Faculty.exists({ id });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid ID');
  }
  if (!payload) {
    throw new AppError(httpStatus.NOT_FOUND, 'Data not found');
  }

  const { name, ...remainingData } = payload;
  const updatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.values(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate({ id }, updatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteFaculty = async (id: string) => {
  const isExist = await Faculty.exists({ id });
  const isExistUser = await User.exists({ id });
  if (!isExist || !isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid ID');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const faculty = await Faculty.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!faculty) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to delete student');
    }

    const user = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const facultyServices = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
