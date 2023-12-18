import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { semesterRegistration } from './semesterRegistration.validation';
import { semesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(semesterRegistration.createSemesterRegistrationSchema),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/:id',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  semesterRegistrationControllers.updateSemesterRegistration,
);

router.get('/', semesterRegistrationControllers.getAllSemesterRegistration);

export const semesterRegistrationRoutes = router;
