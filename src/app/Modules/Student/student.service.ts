import createError from 'http-errors';
import { TStudent } from './student.interface';
import Student from './student.model';

const saveStudentInDB = async (studentData: TStudent) => {
  if (await Student.isUserExist(studentData.id)) {
    throw createError(500, 'user already exist!');
  }
  const result = await Student.create(studentData); // using built in static method
  // const student = new Student(studentData);
  // if (await student.isUserExist(studentData.id)) {
  //   throw createError(500, "User already exist")
  // }
  // const result = await student.save(); // using built in instance method
  return result;
};

const getALlStudentFromDB = async () => {
  // const result = await Student.find({});
  const result = await Student.aggregate([
    { $match: { isDeleted: { $ne: true } } },
  ]);
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.find({ id });
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { $set: { isDeleted: true } });
  return result;
};

export const studentServicer = {
  saveStudentInDB,
  getALlStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
