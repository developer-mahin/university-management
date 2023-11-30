import { Router } from 'express';
import { academicSemesterRoutes } from '../Modules/AcademicSemester/academicSemester.route';
import { studentRoutes } from '../Modules/Student/student.router';
import { userRoutes } from '../Modules/User/user.router';

const router = Router();

const userRouters = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
];

userRouters.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
