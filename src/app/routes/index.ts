import { Router } from 'express';
import { academicDepartmentRoutes } from '../Modules/AcademicDepartment/academicDepartment.routes';
import { academicFacultyRoutes } from '../Modules/AcademicFaculty/academicFaculty.routes';
import { academicSemesterRoutes } from '../Modules/AcademicSemester/academicSemester.routes';
import { adminRoutes } from '../Modules/Admin/admin.routes';
import { authRoutes } from '../Modules/Auth/auth.routes';
import { courseRoutes } from '../Modules/Course/course.routes';
import { enrolledCourseRoutes } from '../Modules/EnrolledCourse/enrolledCourse.routes';
import { facultyRoutes } from '../Modules/Faculty/faculty.routes';
import { studentRoutes } from '../Modules/Student/student.routes';
import { userRoutes } from '../Modules/User/user.routes';
import { offeredCourseRoutes } from '../Modules/offeredCourse/offeredCourse.routes';
import { semesterRegistrationRoutes } from '../Modules/semisterRegistration/semesterRegistration.routes';

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
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/enrolled-course',
    route: enrolledCourseRoutes,
  },
];

userRouters.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
