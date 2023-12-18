import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      required: [true, 'idDeleted is required'],
      default: false,
    },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    prefix: {
      type: String,
      required: [true, 'Prefix is required'],
      trim: true,
    },
    code: {
      type: Number,
      required: [true, 'Code is required'],
    },
    credit: {
      type: Number,
      required: [true, 'Credit is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
  },
  {
    timestamps: true,
  },
);

courseSchema.pre('findOne', async function (next) {
  this.find({
    isDeleted: { $ne: true },
  });
  next();
});

courseSchema.pre('find', async function (next) {
  this.find({
    isDeleted: { $ne: true },
  });
  next();
});

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultiesSchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Course',
    },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Faculty',
      },
    ],
  },
  { timestamps: true },
);

export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultiesSchema,
);
