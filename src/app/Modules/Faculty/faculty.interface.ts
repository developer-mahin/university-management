import { Types } from 'mongoose';

export type TFacultyName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TPresentAddress = {
  city: string;
  home: string;
  house: string;
};

export type TPermanentAddress = {
  city: string;
  home: string;
  house: string;
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
  presentAddress: TPresentAddress;
  permanentAddress: TPermanentAddress;
  profileImage: string;
  academicDepartment?: Types.ObjectId;
  isDeleted: boolean;
};
