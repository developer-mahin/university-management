import express from 'express';
import validateRequest from '../../middleware/validation';
import { studentValidations } from '../Student/student.validation';
import { userController } from './user.controller';
const router = express.Router();

router.post(
  '/create-students',
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudents,
);

export const userRoutes = router;
