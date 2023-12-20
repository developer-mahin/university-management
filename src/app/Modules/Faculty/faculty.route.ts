import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middleware/validation';
import { facultySchemaValidation } from './faculty.validation';
import { auth } from '../../middleware/auth';

const router = Router();

router.get('/', auth(), facultyController.getAllFaculties);
router.get('/:id', facultyController.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(facultySchemaValidation.updateFacultySchema),
  facultyController.updateFaculty,
);
router.delete('/:id', facultyController.deleteFaculty);

export const facultyRoutes = router;
