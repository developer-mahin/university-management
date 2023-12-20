import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';


const router = Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.loginUser,
);

export const authRoutes = router;
