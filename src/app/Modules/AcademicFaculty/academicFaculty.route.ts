import { Router } from 'express';
import { academicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../middleware/validation';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidation.createAcademicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
);

router.get('/:id', academicFacultyController.getSingleAcademicFaculties);
router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyValidation),
  academicFacultyController.updateAcademicFaculties,
);

router.get('/', academicFacultyController.getAllAcademicFaculties);

export const academicFacultyRoutes = router;
