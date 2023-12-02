import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import createError from 'http-errors';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isExist = await AcademicDepartment.exists({
    name: this.name,
  });

  if (isExist) {
    throw createError(500, 'data already exist with this name');
  }

  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isExist = await AcademicDepartment.exists(query);
  if (!isExist) {
    throw createError(404, 'data not found with this info');
  }

  next();
});

const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
export default AcademicDepartment;
