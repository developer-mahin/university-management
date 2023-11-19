import { Student } from './student.interface';
import StudentSchema from './student.model';

const saveStudentInDB = async (studentData: Student) => {
  // const result = await StudentSchema.create(student); // using built in static method
  const student = new StudentSchema(studentData);
  const result = await student.save(); // using built in instance method
  return result;
};

const getALlStudentFromDB = async () => {
  const result = await StudentSchema.find({});
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentSchema.find({ id });
  return result;
};

export const studentServicer = {
  saveStudentInDB,
  getALlStudentFromDB,
  getSingleStudentFromDB,
};
