import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.faculty),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  authControllers.forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  authControllers.resetPassword,
);

export const authRoutes = router;
