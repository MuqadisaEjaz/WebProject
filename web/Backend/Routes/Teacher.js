import bcrypt from 'bcryptjs';
import express from 'express'
import  Teacher  from '../Models/Teacher.js'
import Student from '../Models/Student.js';
const router=express.Router()
import jwt from'jsonwebtoken';
import authMiddleware  from '../Middleware/Auth.js';
import Attendance from '../Models/Attendance.js'
import Marks from '../Models/Marks.js';



//Get The record of all students
router.get('/getAll', authMiddleware(['T']), async (req, res) => {
  try {
    const users =  await Student.find({});
    const students = users.map(user => ({
      Id: user.StudentId,
      name: user.name
    }));
    res.send(students);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

//*******************Login*************************
router.post('/login', async (req, res) => {
  try {

    const { name, password} = req.body;
    //const uid=req.params.id
    const users = await Teacher.findOne({ name});
    if (users.length === 0) {
      res.send('Invalid credentials');
    } else {
      const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

      let token
      try{

        token=jwt.sign({_id:users._id},"Secret");

      }catch(err){

        res.send(err)
      }
      res.json({users,token});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



//**********Create Quiz using Api************************ */
router.get('/quizquestions/:numQuestions/:topic/:difficulty/:type', async (req, res) => {
  console.log(req.params.topic)
  const topic = req.params.topic;
  const difficulty = req.params.difficulty;
  const numQuestions = req.params.numQuestions;
  const type = req.params.type;

  // Fetch quiz questions for the selected topic, difficulty, and number of questions from the Open Trivia Database API
  const quizQuestions = await fetchQuizQuestions(numQuestions,topic, difficulty,type);

  // Return the quiz questions as a JSON response
  res.send(quizQuestions);
});


async function fetchQuizQuestions(numQuestions,topic, difficulty, type) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${numQuestions}&category=${topic}&difficulty=${difficulty}&type=${type}`
  );
  const data = await response.json();

  if (data.response_code === 0) {
    // Questions were found for the given parameters
    return  data.results ;
  } else {
    // No questions were found for the given parameters
    return { message: "No questions found for the given parameters" };
  }
}


// ********************Mark Attendance of students*********************
router.post('/courses/:courseId/attendance', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date, attendanceList } = req.body;

    const attendanceDate = new Date(date);
    attendanceDate.setUTCHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      courseId,
      'attendanceRecords.date': { $eq: attendanceDate },
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for this date' });
    }

    const attendanceRecord = {
      date: attendanceDate,
      attendanceList,
    };

    let attendance = await Attendance.findOne({ courseId });

    if (attendance) {
     
      attendance.attendanceRecords.push(attendanceRecord);
    } else {
      
      attendance = new Attendance({
        courseId,
        attendanceRecords: [attendanceRecord],
      });
    }

    await attendance.save();

    return res.status(200).json({ message: 'Attendance marked successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



//************For MARKS ********************* */

// Add marks for a course
router.post('/courses/:courseId/marks', authMiddleware(['T']), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { examType, totalMarks, students } = req.body;


    const studentMarks = students.map((student) => {
      const { studentId, obtainedMarks } = student;
      return { studentId, obtainedMarks };
    });


    let marks = await Marks.findOne({ courseId });

    if (marks) {
     
      const existingExamType = marks.marks.find((mark) => mark.examType === examType);

      if (existingExamType) {
        return res.status(400).json({ error: 'Exam type already added for the course' });
      }

      marks.marks.push({ examType, totalMarks, studentMarks });

    } else {
      marks = new Marks({
        courseId,
        marks: [{ examType, totalMarks, studentMarks }],
      });
    }

    // Save the marks
    await marks.save();

    return res.status(200).json({ message: 'Marks added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get marks for a course and examType
router.get('/courses/:courseId/marks/:examType', async (req, res) => {
  try {
    const { courseId, examType } = req.params;

    const marks = await Marks.findOne({ courseId });

    if (!marks) {
      return res.status(404).json({ error: 'Marks not found for the given course' });
    }

    const examMarks = marks.marks.find((mark) => mark.examType === examType);

    if (!examMarks) {
      return res.status(404).json({ error: 'Marks not found for the given examType' });
    }

    const { totalMarks, studentMarks } = examMarks

    if (examMarks.studentMarks.length === 0) {
      return res.status(200).json({ message: 'No marks entered for this exam of students' });
    }
    
    return res.status(200).json({totalMarks,studentMarks});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;
