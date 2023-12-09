import httpStatus from 'http-status';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import AppError from '../../utils/AppError';
import Admin from './admin.model';
import { TAdmin } from './admin.interface';
import mongoose from 'mongoose';
import User from '../User/user.model';

const getAllAdmins = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find({}).populate('user'), query);
  const result = adminQuery.queryModel;
  return result;
};

const getSingleAdmin = async (id: string) => {
  const result = await Admin.findOne({ id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  return result;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingData } = payload;
  const isExist = await Admin.exists({ id });
  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin doesn't found");
  }

  const updatedData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      updatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdmin = async (id: string) => {
  const existAdmin = await Admin.exists({ id });
  const existUser = await User.exists({ id });
  if (!existAdmin || !existUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't found");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete user');
    }

    const adminDelete = await Admin.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!adminDelete) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to delete user');
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

export const adminServices = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
