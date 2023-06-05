
import express from 'express'
const router=express.Router()
import authMiddleware  from '../Middleware/Auth.js';
import { loginTeacher,markAttendance ,addMarks,updateMarks,deleteMarks,getMarks,myCourses,createQuiz,viewStudents,myprofile} from '../Controller/Teacher.js'


// routes of a teacher 
router.post('/login',loginTeacher)
router.post('/courses/:courseCode/attendance', authMiddleware(['T']),markAttendance)
router.post('/courses/:courseCode/marks',authMiddleware(['T']), addMarks)
router.put('/courses/:courseCode/marks/:examType',authMiddleware(['T']), updateMarks)
router.delete('/courses/:courseCode/marks/:examType/students/:StudentId',authMiddleware(['T']), deleteMarks)

router.get('/courses/:courseCode/marks/:examType',authMiddleware(['T']),getMarks)
router.get('/mycourses',authMiddleware(['T']), myCourses)
router.get('/viewStudents/:courseCode',authMiddleware(['T']),viewStudents)
//API
router.get('/quizquestions/:numQuestions/:topic/:difficulty/:type',createQuiz)

router.get('/myprofile',authMiddleware(['T']),myprofile)

export default router;
