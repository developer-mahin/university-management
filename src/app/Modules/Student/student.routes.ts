import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middleware/validation';
import { studentValidations } from './student.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.getALlStudent,
);
router.get(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  studentController.getSingleStudent,
);
router.patch(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentController.updateStudent,
);
router.delete(
  '/:studentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  studentController.deleteStudent,
);

export const studentRoutes = router;
