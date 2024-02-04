import mongoose from 'mongoose';
import QueryBuilder from '../../QueryBuilder/QueryBuilder';
import { TCourse, TCourseFaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../utils/AppError';
import httpStatus from 'http-status';

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getCourse = async (query: Record<string, unknown>) => {
  const searchableFields = ['title', 'prefix'];
  
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
  const meta = await courseQuery.countTotal();

  return { meta, result };
};

const getSingleCourse = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const getCourseFacultiesFromDB = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    'faculties',
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

const assignCourseFacultyInDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    { course: id, $addToSet: { faculties: { $each: payload } } },
    { upsert: true, new: true },
  );
  return result;
};

const deleteCourse = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return result;
};

const removeFacultiesFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true },
  );
  return result;
};

export const CourseService = {
  createCourse,
  getCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignCourseFacultyInDB,
  getCourseFacultiesFromDB,
  removeFacultiesFromDB,
};
