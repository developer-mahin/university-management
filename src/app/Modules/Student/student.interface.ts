import { Model } from "mongoose";

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fathersName: string;
  fathersOccupation: string;
  fathersContactNumber: string;
  mothersName: string;
  mothersOccupation: string;
  mothersContactNumber: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNumber: string;
  emailAddress: string;
  address: {
    village: string;
    city: string;
    home: string;
  };
};

export type TStudent = {
  id: string;
  name: TName;
  dateOfBirth: string;
  age: number;
  email: string;
  gender: 'male' | 'female';
  contactNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profilePic: string;
  isActive: 'active' | 'blocked';
};

// creating custom methods
export type StudentMethods = {
  isUserExist: (id: string) => Promise<TStudent | null>
}

export type StudentModel = Model<TStudent, Record<string, never>, StudentMethods>
