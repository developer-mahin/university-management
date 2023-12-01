import { Router } from 'express';
import { academicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middleware/validation';
import { academicDepartmentValidation } from './academicDepartment.validation';

const router = Router();

router.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidation.createAcademicDepartmentValidation,
  ),
  academicDepartmentController.createAcademicDepartment,
);

router.get('/', academicDepartmentController.getAllAcademicDepartment);
router.get('/:id', academicDepartmentController.getSingleAcademicDepartment);
router.patch(
  '/:id',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidation,
  ),
  academicDepartmentController.updateAcademicDepartment,
);

export const academicDepartmentRoutes = router;
