import { Types } from 'mongoose';

export type TFacultyName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TFacultyName;
  gender: 'Male' | 'Female' | 'Others';
  bloodGroup: TBloodGroup;
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  academicDepartment?: Types.ObjectId;
  isDeleted: boolean;
};
