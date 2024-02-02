import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middleware/validation';
import { studentValidations } from '../Student/student.validation';
import { userController } from './user.controller';
import { facultySchemaValidation } from '../Faculty/faculty.validation';
import { AdminSchemaValidation } from '../Admin/admin.validation';
import { auth } from '../../middleware/auth';
import { userValidation } from './user.validation';
import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/sendImageIntoCloudinary';

const router = express.Router();

router.post(
  '/create-students',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudents,
);

router.post(
  '/create-faculties',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultySchemaValidation.createFacultySchema),
  userController.createFaculty,
);

router.post(
  '/create-admins',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminSchemaValidation.createAdminSchema),
  userController.createAdmin,
);

router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(userValidation.changeStatusValidationSchema),
  userController.changeStatus,
);

router.get('/me', auth('admin', 'faculty', 'student'), userController.getMe);

export const userRoutes = router;
