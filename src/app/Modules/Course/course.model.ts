import { Schema, model } from 'mongoose';
import { TCourse, TPreRequisiteCourses } from './course.interface';

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

const Course = model<TCourse>('Course', courseSchema);

export default Course;
