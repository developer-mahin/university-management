import express from 'express';
import { studentController } from './student.controller';
const router = express.Router();

router.post('/create_student', studentController.createStudent);
router.get('/', studentController.getALlStudent);
router.get('/:studentId', studentController.getSingleStudent);

export const studentRoutes = router;
