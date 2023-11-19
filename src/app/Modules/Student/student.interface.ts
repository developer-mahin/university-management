export type Name = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type Guardian = {
  fathersName: string;
  fathersOccupation: string;
  fathersContactNumber: string;
  mothersName: string;
  mothersOccupation: string;
  mothersContactNumber: string;
};

export type LocalGuardian = {
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

export type Student = {
  id: string;
  name: Name;
  dateOfBirth: string;
  age: number;
  email: string;
  gender: 'male' | 'female';
  contactNumber: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
  localGuardian: LocalGuardian;
  profilePic: string;
  isActive: 'active' | 'blocked';
};

// creating custom
