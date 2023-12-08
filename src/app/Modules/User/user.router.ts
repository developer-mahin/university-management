import express from 'express';
import validateRequest from '../../middleware/validation';
import { studentValidations } from '../Student/student.validation';
import { userController } from './user.controller';
import { facultySchemaValidation } from '../Faculty/faculty.validation';
const router = express.Router();

router.post(
  '/create-students',
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudents,
);

router.post(
  '/create-faculties',
  validateRequest(facultySchemaValidation.createFacultySchema),
  userController.createFaculty,
);

export const userRoutes = router;
