import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordUpdatedAt: {
      type: Date,
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

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

// post middlewares
userSchema.post('save', function (doc, next) {
  this.password = '';
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (id: string) {
  console.log(id);
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isMatchedPassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangeTimeStamps: Date,
  jwtIssuedTimeStamps: number,
) {
  const passwordChangedTime =
    new Date(passwordChangeTimeStamps).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimeStamps;
};

const User = model<TUser, UserModel>('User', userSchema);
export default User;
