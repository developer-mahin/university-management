import { Router } from 'express';
import { academicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../middleware/validation';
import { academicFacultyValidation } from './academicFaculty.validation';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
