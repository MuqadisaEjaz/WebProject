import bcrypt from 'bcryptjs';
import  Teacher  from '../Models/Teacher.js'
import Student from '../Models/Student.js';
import RegisteredCourse from '../models/RegisteredCourse.js';
import jwt from'jsonwebtoken';
import Attendance from '../Models/Attendance.js'
import Marks from '../Models/Marks.js';
import Assignment from '../Models/CourseAssigned.js';

//*******************Login*************************

const loginTeacher = async (req, res) => {
    try {
  
      const { TeacherId, password} = req.body;

      const users = await Teacher.findOne({ TeacherId});
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

       // res.header('Authorization', `Bearer ${token}`);
        res.json({users,token});
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };


//***************Mark Attendance************************** */

const markAttendance = async (req, res) => {

    try {
      const { courseId } = req.params;
      const { date, attendanceList } = req.body;   //list holding student ids and their attendance
  
      const attendanceDate = new Date(date);
      attendanceDate.setUTCHours(0, 0, 0, 0);
  
      const existingAttendance = await Attendance.findOne({courseId, 'attendanceRecords.date': { $eq: attendanceDate },});
  
      if (existingAttendance) {
        return res.status(400).json({ error: 'Attendance already marked for this date' });
      }
  
      const attendanceRecord = {            // date alone with attendance list
        date: attendanceDate,
        attendanceList,
      };
  
      let attendance = await Attendance.findOne({ courseId });
  
      if (attendance) {
       
        attendance.attendanceRecords.push(attendanceRecord);  //adding record if course already added
      } else {
        
        attendance = new Attendance({       //new record 
          courseId,
          attendanceRecords: [attendanceRecord],
        });
      }
  
      await attendance.save();
  
      return res.status(200).json({ message: 'Attendance marked successfully' });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server Error' });
    }
  }




//******************Manage Marks **************************** */


//********Add Marks************** */

const addMarks = async (req, res) => {
  
  try {
    const { courseId } = req.params;
    const { examType, totalMarks, students } = req.body;

    const studentMarks = students.map((student) => {
      const { studentId, obtainedMarks } = student;
      return { studentId, obtainedMarks };
    });


    let coursemarks = await Marks.findOne({ courseId });

    if (coursemarks) {
     
      const existingExamType = coursemarks.marks.find((mark) => mark.examType === examType);

      if (existingExamType) {
        return res.status(400).json({ error: 'Exam type already added for the course' });
      }

      coursemarks.marks.push({ examType, totalMarks, studentMarks });   //adding into exsisting 
      // creating new record
    } else {
      coursemarks = new Marks({
        courseId,
        marks: [{ examType, totalMarks, studentMarks }],
      });
    }

    await coursemarks.save();

    return res.status(200).json({ message: 'Marks added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}
  

//***********Update Marks of students for a specific exam in a course****************** */

const updateMarks = async (req, res) => {

    try {
      const { courseId, examType } = req.params;
      const { studentMarks } = req.body;
      
      const coursemarks = await Marks.findOne({ courseId });
  
      if (!coursemarks) {
        return res.status(404).json({ error: 'Marks not found for the given course' });
      }
  
      const examMarks = coursemarks.marks.find((mark) => mark.examType === examType);
  
      if (!examMarks) {
        return res.status(404).json({ error: 'Marks not found for the given examType' });
      }
      //updating marks if record found
      examMarks.studentMarks.forEach((student) => {
        console.log(student)

        const updatedStudent = studentMarks.find((updatedStudent) => updatedStudent.studentId === student.studentId);
        if (updatedStudent) {
          student.obtainedMarks = updatedStudent.obtainedMarks;
        }

      });
  
      await coursemarks.save();

      return res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server Error' });
    }
  }
  
  
//*************Delete marks of a student for a specific exam in a course ********************** */


const deleteMarks = async (req, res) => {
    try {
      const { courseId, examType, studentId } = req.params;
  
      const coursemarks = await Marks.findOne({ courseId });
  
      if (!coursemarks) {
        return res.status(404).json({ error: 'Marks not found for the given course' });
      }
  
      const examMarks = coursemarks.marks.find((mark) => mark.examType === examType);
  
      if (!examMarks) {
        return res.status(404).json({ error: 'Marks not found for the given examType' });
      }
  
      const student = examMarks.studentMarks.find((student) => student.studentId === studentId);
  
      if (!student) {
        return res.status(404).json({ error: 'No such student with the given studentId' });
      }

      // deleting marks if record found
      examMarks.studentMarks = examMarks.studentMarks.filter((student) => student.studentId !== studentId);
  
      await coursemarks.save();
  
      return res.status(200).json({ message: 'Marks deleted successfully' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server Error' });
    }
  }


// *************Get marks for a course and examType***************

const getMarks = async (req, res) => {
    try {
      const { courseId, examType } = req.params;
  
      const coursemarks = await Marks.findOne({ courseId });
  
      if (!coursemarks) {
        return res.status(404).json({ error: 'Marks not found for the given course' });
      }
  
      const examMarks = coursemarks.marks.find((mark) => mark.examType === examType);
  
      if (!examMarks) {
        return res.status(404).json({ error: 'Marks not found for the given examType' });
      }

      if (examMarks.studentMarks.length === 0) {
        return res.status(200).json({ message: 'No marks entered for this exam of students' });
      }
  
      const { totalMarks, studentMarks } = examMarks      //storing total marks and list of students with their marks. 

      return res.status(200).json({totalMarks,studentMarks});
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

//********************Display teacher course*************************** */
const myCourses = async (req, res) => {

    const teacherReg=req.TeacherId;
try{
    const present= await Assignment.findOne({teacherReg});
    if(!present){
      res.send("No courses are assigned")
    }

    const mycourses = present.courseCode

    res.send(mycourses)
  }catch{
  
    return res.status(500).json({ error: 'Server Error' });
  }
}


//*********************Quiz API********************* */

// //**********Create Quiz using Api************************ */
const createQuiz = async (req, res) => {

  console.log(req.params.numQuestions)
  const topic = req.params.topic;
  const difficulty = req.params.difficulty;
  const numQuestions = req.params.numQuestions;
  const type = req.params.type;

  // Fetch quiz questions for the selected topic, difficulty, and number of questions from the Open Trivia Database API
  const quizQuestions = await fetchQuizQuestions(numQuestions,topic, difficulty,type);

  // Return the quiz questions as a JSON response
  res.send(quizQuestions);
}


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

// //Get The record of all students
// router.get('/getAll', authMiddleware(['T']), async (req, res) => {
//   try {
//     const users =  await Student.find({});
//     const students = users.map(user => ({
//       Id: user.StudentId,
//       name: user.name
//     }));
//     res.send(students);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// });



  export { loginTeacher,markAttendance ,addMarks,updateMarks,deleteMarks,getMarks,myCourses,createQuiz};
