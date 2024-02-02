import { Router } from 'express';
import { academicDepartmentController } from './academicDepartment.controller';
import validateRequest from '../../middleware/validation';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
