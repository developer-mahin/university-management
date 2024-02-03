import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { semesterRegistration } from './semesterRegistration.validation';
import { semesterRegistrationControllers } from './semesterRegistration.controller';
import { USER_ROLE } from '../User/user.constant';
import { auth } from '../../middleware/auth';

const router = Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(semesterRegistration.createSemesterRegistrationSchema),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  semesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  semesterRegistrationControllers.deleteSemesterRegistration,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  semesterRegistrationControllers.getAllSemesterRegistration,
);

export const semesterRegistrationRoutes = router;
