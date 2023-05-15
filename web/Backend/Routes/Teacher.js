
import express from 'express'
const router=express.Router()
import authMiddleware  from '../Middleware/Auth.js';
import { loginTeacher,markAttendance ,addMarks,updateMarks,deleteMarks,getMarks,myCourses,createQuiz} from '../Controller/Teacher.js'



// routes of a teacher 
router.post('/login',loginTeacher)
router.post('/courses/:courseId/attendance', authMiddleware(['T']),markAttendance)
router.post('/courses/:courseId/marks', authMiddleware(['T']), addMarks)
router.put('/courses/:courseId/marks/:examType',authMiddleware(['T']), updateMarks)
router.delete('/courses/:courseId/marks/:examType/students/:studentId',authMiddleware(['T']), deleteMarks)
router.get('/courses/:courseId/marks/:examType', authMiddleware(['T']),getMarks)
router.get('/mycourses',authMiddleware(['T']), myCourses)
// router.get('/viewStudents/:coursecode',authMiddleware(['T']),viewStudents)
//API
router.get('/quizquestions/:numQuestions/:topic/:difficulty/:type',authMiddleware(['T']),createQuiz)

export default router;
