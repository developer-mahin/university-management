import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt, { genSaltSync } from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const password = this.password;
  const hashPassword = bcrypt.hashSync(password, genSaltSync(10));
  this.password = hashPassword;
  next();
});

// post middlewares
userSchema.post('save', function (doc, next) {
  this.password = '';
  doc.password = '';
  next();
});

const User = model('User', userSchema);
export default User;
