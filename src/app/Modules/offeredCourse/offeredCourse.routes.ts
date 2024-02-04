import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { offeredCourseValidationSchema } from './offeredCourse.validation';
import { offerCourseController } from './offeredCourse.controller';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-offered-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offeredCourseValidationSchema.createOfferedCourseSchema),
  offerCourseController.createOfferedCourse,
);

router.get(
  '/my-offered-courses',
  auth(USER_ROLE.student),
  offerCourseController.getMyOfferedCourses,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  offerCourseController.getAllOfferedCourses,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  offerCourseController.getSingleOfferedCourses,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offeredCourseValidationSchema.updateOfferedCourseSchema),
  offerCourseController.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  offerCourseController.deleteOfferedCourseFromDB,
);

export const offeredCourseRoutes = router;
