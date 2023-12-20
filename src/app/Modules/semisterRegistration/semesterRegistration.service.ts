import httpStatus from 'http-status';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import AppError from '../../utils/AppError';
import AcademicSemester from '../AcademicSemester/academicSemester.model';
import { registrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import SemesterRegistration from './semesterRegistration.model';

const createSemesterRegistrationInToDB = async (
  payload: TSemesterRegistration,
) => {
  const isThereAnyUpcomingOngoingSemester = await SemesterRegistration.findOne({
    $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
  });

  if (isThereAnyUpcomingOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already have an ${isThereAnyUpcomingOngoingSemester.status} registered semester`,
    );
  }

  const isExistAcademicSemester = await AcademicSemester.findById(
    payload?.academicSemester,
  );
  if (!isExistAcademicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found'!);
  }

  const isExistRegister = await SemesterRegistration.findOne({
    _id: payload?.academicSemester,
  });

  if (isExistRegister) {
    throw new AppError(httpStatus.CONFLICT, 'semester is already exist!');
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .fields()
    .filter()
    .sort()
    .paginate();

  const result = await semesterRegistrationQuery.queryModel;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isExist = await SemesterRegistration.findById(id);
  const currentStatus = isExist?.status;
  const requestedStatus = payload.status;

  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration is not found!',
    );
  }

  if (isExist?.status === registrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This semester is already ENDED',
    );
  }

  if (
    currentStatus === registrationStatus.UPCOMING &&
    requestedStatus === registrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `con't update directly ${currentStatus} to ${requestedStatus}`,
    );
  }

  if (
    currentStatus === registrationStatus.ONGOING &&
    requestedStatus === registrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `con't update directly ${currentStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegistrationInToDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
