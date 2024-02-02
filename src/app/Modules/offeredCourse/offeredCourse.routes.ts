import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { offeredCourseValidationSchema } from './offeredCourse.validation';
import { offerCourseController } from './offeredCourse.controller';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidationSchema.createOfferedCourseSchema),
  offerCourseController.createOfferedCourse,
);

router.get('/', offerCourseController.getAllOfferedCourses);
router.get('/:id', offerCourseController.getSingleOfferedCourses);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidationSchema.updateOfferedCourseSchema),
  offerCourseController.updateOfferedCourse,
);

router.delete('/:id', offerCourseController.deleteOfferedCourseFromDB);
export const offeredCourseRoutes = router;
