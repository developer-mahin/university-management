import createError from 'http-errors';
import { TStudent } from './student.interface';
import Student from './student.model';

const saveStudentInDB = async (studentData: TStudent) => {
  // const result = await StudentSchema.create(student); // using built in static method
  const student = new Student(studentData);
  if (await student.isUserExist(studentData.id)) {
    throw createError(500, "User already exist")
  }
  const result = await student.save(); // using built in instance method
  return result;
};

const getALlStudentFromDB = async () => {
  const result = await Student.find({});
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.find({ id });
  return result;
};

export const studentServicer = {
  saveStudentInDB,
  getALlStudentFromDB,
  getSingleStudentFromDB,
};
