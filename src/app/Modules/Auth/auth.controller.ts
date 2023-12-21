import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUserInToDB(req.body);

  const { accessToken, refreshToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Your are login successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  const result = await authServices.changePassword(user, passwordData);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'successfully updated Password',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Token retrieved successful',
    data: result,
  });
});

export const authControllers = {
  loginUser,
  changePassword,
  refreshToken,
};
