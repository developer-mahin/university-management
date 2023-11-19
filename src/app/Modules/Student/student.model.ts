import { Schema, model } from 'mongoose';
import { Guardian, LocalGuardian, Name, Student } from './student.interface';
// import validator from 'validator';

const nameSchema = new Schema<Name>({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    minlength: [3, "first name can't be allow less than 3 character"],
    maxlength: [20, "first name can't be allow more than 20 character"],
    // validate: {
    //   validator(value: string) {
    //     const nameValidate = value.charAt(0).toUpperCase() + value.slice(1);
    //     return nameValidate === value;
    //   },
    //   message: '{VALUE} is not capital formate',
    // },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
    minlength: [3, "first name can't be allow less than 3 character"],
    maxlength: [20, "last name can't be allow more than 20 character"],
  },
});

const guardianSchema = new Schema<Guardian>({
  fathersName: {
    type: String,
    required: [true, "Father's name is required."],
  },
  fathersOccupation: {
    type: String,
    required: [true, "Father's occupation is required."],
  },
  fathersContactNumber: {
    type: String,
    required: [true, "Father's contact number is required."],
  },
  mothersName: {
    type: String,
    required: [true, "Mother's name is required."],
  },
  mothersOccupation: {
    type: String,
    required: [true, "Mother's occupation is required."],
  },
  mothersContactNumber: {
    type: String,
    required: [true, "Mother's contact number is required."],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name is required.'],
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required.'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Local guardian contact number is required.'],
  },
  emailAddress: {
    type: String,
    required: [true, 'Local guardian email address is required.'],
  },
  address: {
    village: {
      type: String,
      required: [true, 'Local guardian village is required.'],
    },
    city: {
      type: String,
      required: [true, 'Local guardian city is required.'],
    },
    home: {
      type: String,
      required: [true, 'Local guardian home is required.'],
    },
  },
});

const studentSchema = new Schema<Student>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required.'],
      unique: true,
      // validate: {
      //   validator: (value: string) => validator.isNumeric(value),
      //   message: '{VALUE} is not valid number',
      // },
    },
    name: {
      type: nameSchema,
      required: [true, 'Student name is required.'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required.'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not valid email address',
      // },
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required.'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required.'],
      // validate: {
      //   validator: (value: string) => validator.isMobilePhone(value),
      //   message: '{VALUE} is not valid phone number',
      // },
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required.'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required.'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required.'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required.'],
    },
    profilePic: {
      type: String,
      required: [true, 'Profile picture is required.'],
    },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  { timestamps: true },
);

const StudentSchema = model<Student>('Student', studentSchema);
export default StudentSchema;
