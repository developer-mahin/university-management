import { Router } from 'express';
import { academicSemesterRoutes } from '../Modules/AcademicSemester/academicSemester.route';
import { studentRoutes } from '../Modules/Student/student.router';
import { userRoutes } from '../Modules/User/user.router';
import { academicFacultyRoutes } from '../Modules/AcademicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../Modules/AcademicDepartment/academicDepartment.route';
import { facultyRoutes } from '../Modules/Faculty/faculty.route';
import { adminRoutes } from '../Modules/Admin/admin.route';

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
    path: '/faculties',
    route: facultyRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: academicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: academicDepartmentRoutes,
  },
];

userRouters.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
