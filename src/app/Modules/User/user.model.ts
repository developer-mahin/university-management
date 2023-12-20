import bcrypt, { genSaltSync } from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
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

userSchema.statics.isUserExist = async function (id: string) {
  return await User.findOne({ id });
};

userSchema.statics.isMatchedPassword = async function (password, hashPassword) {
  return await bcrypt.compareSync(password, hashPassword);
};

const User = model<TUser, UserModel>('User', userSchema);
export default User;
