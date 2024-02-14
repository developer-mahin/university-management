import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middleware/validation';
import { facultySchemaValidation } from './faculty.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  facultyController.getAllFaculties,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  facultyController.getSingleFaculty,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(facultySchemaValidation.updateFacultySchema),
  facultyController.updateFaculty,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  facultyController.deleteFaculty,
);

export const facultyRoutes = router;
