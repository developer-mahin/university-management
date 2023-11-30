import { Router } from 'express';
import { academicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validation';
import { academicSemesterValidation } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(academicSemesterValidation.createAcademicSemesterValidation),
  academicSemesterController.createAcademicSemester,
);
router.get('/', academicSemesterController.getAllSemester);
router.get('/:id', academicSemesterController.getSingleSemester);
router.patch('/:id', academicSemesterController.updateSemester);

export const academicSemesterRoutes = router;
