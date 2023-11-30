import bcrypt, { genSaltSync } from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
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

const User = model<TUser>('User', userSchema);
export default User;
