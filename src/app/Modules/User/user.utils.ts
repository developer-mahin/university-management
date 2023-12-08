import { TAcademicSemester } from '../AcademicSemester/academicSemester.interface';
import User from './user.model';

const findLatestStudentId = async () => {
  const latestId = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  return latestId?.id ? latestId?.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();

  const lastStudentId = await findLatestStudentId();

  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const currentStudentYear = payload.year;
  const currentStudentCode = payload.code;

  if (
    lastStudentId &&
    lastStudentSemesterYear === currentStudentYear &&
    lastStudentSemesterCode === currentStudentCode
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

const findLastFacultyId = async () => {
  const getLastId = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean();

  return getLastId?.id ? getLastId?.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  const lastId = await findLastFacultyId();
  let currentId = (0).toString();
  if (lastId) {
    currentId = lastId;
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};
