import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourses, courseDetail, buyCourse } from '../controllers/coursecontrollers.js';
import { userMiddleware } from '../middleware/userMiddleware.js';
import { adminMiddleware } from '../middleware/adminMidleware.js';

const router = express.Router();

router.post("/create",adminMiddleware,createCourse);
router.put("/update/:courseId",adminMiddleware,updateCourse) // we write :courseid instead of just courseid because :courseid is a route parameter.
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/getCourses",getCourses)
router.get("/courseDetail/:courseId",courseDetail)
router.post("/buy/:courseId",userMiddleware,buyCourse)

export default router;
