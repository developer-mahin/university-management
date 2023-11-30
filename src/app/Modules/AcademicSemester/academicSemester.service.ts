import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import AcademicSemester from './academicSemester.model';

const createAcademicSemester = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("Name and code does'nt match!");
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllSemester = async () => {
  const result = await AcademicSemester.find({});
  return result;
};

const getSingleSemester = async (id: string) => {
  const result = await AcademicSemester.findOne({ _id: id });
  return result;
};

const updateSemester = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {

  const isExist = await AcademicSemester.exists({
    year: payload.year,
    name: payload.name
  })

  if (isExist) {
    throw new Error("Semester already exist, you can't update!")
  }

  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }


  const result = await AcademicSemester.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true },
  );
  return result;
};

export const academicSemesterService = {
  createAcademicSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester,
};
