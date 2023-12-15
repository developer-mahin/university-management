import mongoose from 'mongoose';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import { TCourse } from './course.interface';
import Course from './course.model';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getCourse = async (query: Record<string, unknown>) => {
  const searchableFields = ['title', 'prefix', 'code'];
  const courseQuery = new QueryBuilder(
    Course.find({}).populate('preRequisiteCourses.course'),
    query,
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.queryModel;
  return result;
};

const getSingleCourse = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourse = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const basicUpdate = await Course.findByIdAndUpdate(id, remainingData, {
      new: true,
      runValidators: true,
      session,
    });
    if (!basicUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to update');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePreRequisiteCourses = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const preRequisiteCoursesDelete = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletePreRequisiteCourses } },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!preRequisiteCoursesDelete) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update');
      }
    }

    const newPreRequisiteCourses = preRequisiteCourses?.filter(
      (el) => el.course && !el.isDeleted,
    );

    const updatePreRequisiteCourse = await Course.findByIdAndUpdate(
      id,
      {
        $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourses } },
      },
      { new: true, runValidators: true, session },
    );
    if (!updatePreRequisiteCourse) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update');
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );

    return result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const deleteCourse = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return result;
};

export const CourseService = {
  createCourse,
  getCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
};
