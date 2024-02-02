import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { courseValidation } from './course.validation';
import { CourseController } from './course.controller';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidation.createCourseValidationSchema),
  CourseController.createCourse,
);
router.get('/', CourseController.getCourse);
router.get('/:id', CourseController.getSingleCourse);
router.patch(
  '/:id',
  validateRequest(courseValidation.updateCourseValidationSchema),
  CourseController.updateCourse,
);

router.put(
  '/:id/assign-faculties',
  validateRequest(courseValidation.assignFacultiesValidationSchema),
  CourseController.assignCourseFaculty,
);

router.delete(
  '/:id/remove-faculties',
  validateRequest(courseValidation.assignFacultiesValidationSchema),
  CourseController.removeFaculties,
);
router.delete('/:id', CourseController.deleteCourse);

export const courseRoutes = router;
