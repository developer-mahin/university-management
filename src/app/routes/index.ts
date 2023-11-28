import { Router } from "express";
import { userRouter } from "../Modules/User/user.router";
import { studentRoutes } from "../Modules/Student/student.router";

const router = Router()


const userRouters = [
    {
        path: "/users",
        route: userRouter
    },
    {
        path: "/students",
        route: studentRoutes
    },
]

userRouters.forEach(route => {
    router.use(route.path, route.route)
});


export default router;