import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middleware/validation';
import { studentValidations } from './student.validation';
const router = express.Router();

router.get('/', studentController.getALlStudent);
router.get('/:studentId', studentController.getSingleStudent);
router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentController.updateStudent,
);
router.delete('/:studentId', studentController.deleteStudent);

export const studentRoutes = router;
