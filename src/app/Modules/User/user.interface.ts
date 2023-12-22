/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id: string;
  email:string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'faculty' | 'student';
  isDeleted: boolean;
  passwordUpdatedAt?: Date;
  status: 'in-progress' | 'blocked';
};

export interface UserModel extends Model<TUser> {
  isUserExist(id: string): Promise<TUser>;
  isMatchedPassword(password: string, hashPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangeTimeStamps: Date,
    jwtIssuedTimeStamps: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
