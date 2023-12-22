import express from 'express';
import validateRequest from '../../middleware/validation';
import { studentValidations } from '../Student/student.validation';
import { userController } from './user.controller';
import { facultySchemaValidation } from '../Faculty/faculty.validation';
import { AdminSchemaValidation } from '../Admin/admin.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
const router = express.Router();

router.post(
  '/create-students',
  // auth(USER_ROLE.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudents,
);

router.post(
  '/create-faculties',
  validateRequest(facultySchemaValidation.createFacultySchema),
  userController.createFaculty,
);

router.post(
  '/create-admins',
  validateRequest(AdminSchemaValidation.createAdminSchema),
  userController.createAdmin,
);

export const userRoutes = router;
