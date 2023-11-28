import config from '../../config';
import { TStudent } from '../Student/student.interface';
import Student from '../Student/student.model';
import { IUser } from './user.interface';
import User from './user.model';

const saveStudentsInDB = async (password: string, studentData: TStudent) => {
  const newUser: Partial<IUser> = {};
  // set password
  newUser.password = password || (config.defaultPassword as string);
  // set student id
  newUser.id = studentData.id || '2030100001';
  // set user role
  newUser.role = 'student';

  const result = await User.create(newUser);

  if (Object.keys(result).length) {
    studentData.id = result.id;
    studentData.user = result._id;
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const userServices = {
  saveStudentsInDB,
};
