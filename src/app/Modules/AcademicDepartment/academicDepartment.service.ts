import createError from 'http-errors';
import { TAcademicDepartment } from './academicDepartment.interface';
import AcademicDepartment from './academicDepartment.model';

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartment = async () => {
  const result = await AcademicDepartment.find({});
  return result;
};

const getSingleAcademicDepartment = async (id: string) => {
  const result = await AcademicDepartment.findOne({ _id: id });
  return result;
};

const updateAcademicDepartment = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const isExist = await AcademicDepartment.exists({ _id: id });
  if (!isExist) {
    throw createError(404, 'data not found with this info');
  }

  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return result;
};

export const academicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
