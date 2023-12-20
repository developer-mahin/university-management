import { Router } from 'express';
import { academicSemesterRoutes } from '../Modules/AcademicSemester/academicSemester.route';
import { studentRoutes } from '../Modules/Student/student.router';
import { userRoutes } from '../Modules/User/user.router';
import { academicFacultyRoutes } from '../Modules/AcademicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../Modules/AcademicDepartment/academicDepartment.route';
import { facultyRoutes } from '../Modules/Faculty/faculty.route';
import { adminRoutes } from '../Modules/Admin/admin.route';
import { courseRoutes } from '../Modules/Course/course.route';
import { semesterRegistrationRoutes } from '../Modules/semisterRegistration/semesterRegistration.route';
import { offeredCourseRoutes } from '../Modules/offeredCourse/offeredCourse.route';

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
    path: '/courses',
    route: courseRoutes,
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
  {
    path: '/semester-registration',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-course',
    route: offeredCourseRoutes,
  },
];

userRouters.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
