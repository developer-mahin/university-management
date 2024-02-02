import { Router } from 'express';
import { academicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middleware/validation';
import { academicSemesterValidation } from './academicSemester.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(academicSemesterValidation.createAcademicSemesterValidation),
  academicSemesterController.createAcademicSemester,
);
router.get(
  '/',
  auth(USER_ROLE.admin),
  academicSemesterController.getAllSemester,
);
router.get('/:id', academicSemesterController.getSingleSemester);
router.patch(
  '/:id',
  validateRequest(academicSemesterValidation.updateAcademicSemesterValidation),
  academicSemesterController.updateSemester,
);

export const academicSemesterRoutes = router;
