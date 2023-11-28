import express from 'express';
import { userController } from './user.controller';
const router = express.Router();

router.post('/create-students', userController.createStudents);

export const userRouter = router;
