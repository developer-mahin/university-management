import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {

  const result = await authServices.loginUserInToDB(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: 'Your are login successfully',
    data: result,
  });
});

export const authControllers = {
  loginUser,
};
