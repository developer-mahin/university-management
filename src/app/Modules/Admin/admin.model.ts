import { Schema, model } from 'mongoose';
import { TAdmin, TAdminName } from './admin.interface';

const facultyNameSchema = new Schema<TAdminName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
});

const adminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: [true, 'Faculty ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: {
      type: facultyNameSchema,
      required: [true, 'Name is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
      required: [true, 'Gender is required'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: [true, 'Blood group is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'permanentAddress is required'],
    },
    profileImage: {
      type: String,
      default: '',
    },
    isDeleted: {
      type: Boolean,
      required: [true, 'Deletion status is required'],
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

adminSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

adminSchema.pre('find', async function (next) {
  this.find({
    isDeleted: { $ne: true },
  });
  next();
});

adminSchema.pre('findOne', async function (next) {
  this.findOne({
    isDeleted: { $ne: true },
  });

  next();
});

const Admin = model<TAdmin>('Admin', adminSchema);
export default Admin;
