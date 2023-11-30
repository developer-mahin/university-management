import config from '../../config';
import AcademicSemester from '../AcademicSemester/academicSemester.model';
import { TStudent } from '../Student/student.interface';
import Student from '../Student/student.model';
import { TUser } from './user.interface';
import User from './user.model';
import { generateStudentId } from './user.utils';

const saveStudentsInDB = async (password: string, payload: TStudent) => {
  const newUser: Partial<TUser> = {};
  // set password
  newUser.password = password || (config.defaultPassword as string);



  // set student id
  // newUser.id = payload.id || '2030100001'

  // set user role

  newUser.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(payload.admissionSemester)

  if (admissionSemester && Object.keys(admissionSemester).length) {
    newUser.id = generateStudentId(admissionSemester)
  } else {
    throw new Error("Admission Semester not found")
  }


  const result = await User.create(newUser);

  if (Object.keys(result).length) {
    payload.id = result.id;
    payload.user = result._id;
    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const userServices = {
  saveStudentsInDB,
};
