import bcrypt from 'bcryptjs';
import  Teacher  from '../Models/Teacher.js'
import Student from '../Models/Student.js';
import jwt from'jsonwebtoken';
import Attendance from '../Models/Attendance.js'
import Marks from '../Models/Marks.js';
import Assignment from '../Models/CourseAssigned.js';
import RegisteredCourses from '../Models/RegisteredCourses.js'

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
      const { courseCode } = req.params;
      const { date, attendanceList } = req.body;   //list holding student ids and their attendance
  
      const attendanceDate = new Date(date);
      attendanceDate.setUTCHours(0, 0, 0, 0);
  
      const existingAttendance = await Attendance.findOne({courseCode, 'attendanceRecords.date': { $eq: attendanceDate },});
  
      if (existingAttendance) {
        return res.status(400).json({ error: 'Attendance already marked for this date' });
      }
  
      const attendanceRecord = {            // date alone with attendance list
        date: attendanceDate,
        attendanceList,
      };
  
      let attendance = await Attendance.findOne({ courseCode });
  
      if (attendance) {
       
        attendance.attendanceRecords.push(attendanceRecord);  //adding record if course already added
      } else {
        
        attendance = new Attendance({       //new record 
          courseCode,
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
    const { courseCode } = req.params;
    console.log(courseCode)
    const { examType, totalMarks, students } = req.body;
    console.log(examType)
    const studentMarks = students.map((student) => {
      const { StudentId, obtainedMarks } = student;
      return { StudentId, obtainedMarks };
    });


    let coursemarks = await Marks.findOne({ courseCode });

    if (coursemarks) {
     
      const existingExamType = coursemarks.marks.find((mark) => mark.examType === examType);

      if (existingExamType) {
        return res.status(400).json({ error: 'Exam type already added for the course' });
      }

      coursemarks.marks.push({ examType, totalMarks, studentMarks });   //adding into exsisting 
      // creating new record
    } else {
      coursemarks = new Marks({
        courseCode,
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
      const { courseCode, examType } = req.params;
      const { studentMarks } = req.body;
      
      const coursemarks = await Marks.findOne({ courseCode });
  
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

        const updatedStudent = studentMarks.find((updatedStudent) => updatedStudent.StudentId === student.StudentId);
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
      const { courseCode, examType, StudentId } = req.params;
      console.log(StudentId)
      console.log(courseCode)

      const coursemarks = await Marks.findOne({ courseCode });
  
      if (!coursemarks) {
        return res.status(404).json({ error: 'Marks not found for the given course' });
      }
  
      const examMarks = coursemarks.marks.find((mark) => mark.examType === examType);
  
      if (!examMarks) {
        return res.status(404).json({ error: 'Marks not found for the given examType' });
      }
  
      const student = examMarks.studentMarks.find((student) => student.StudentId === StudentId);
  
      if (!student) {
        return res.status(404).json({ error: 'No such student with the given StudentId' });
      }

      // deleting marks if record found
      examMarks.studentMarks = examMarks.studentMarks.filter((student) => student.StudentId !== StudentId);

      if (examMarks.studentMarks.length === 0) {
        const examIndex = coursemarks.marks.findIndex((mark) => mark.examType === examType);
        coursemarks.marks.splice(examIndex, 1);
      }
  
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
      const { courseCode, examType } = req.params;
      const teacherId = req.TeacherId;
      
      const teacherAssignedCourse = await Assignment.findOne({
        teacherReg: teacherId,
        courseCode: courseCode
      });
      
      if (!teacherAssignedCourse) {
        return res.status(404).json({ error: 'This is not your allocated course.' });
      }
    
      const coursemarks = await Marks.findOne({ courseCode });
  
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


const viewStudents = async (req, res) => {
  const { courseCode } = req.params;
  const teacherId = req.TeacherId;

  
  try {
    // Check if the course is assigned to the teacher
    const teacherAssignedCourse = await Assignment.findOne({
      teacherReg: teacherId,
      courseCode: courseCode
    });
    
    if (!teacherAssignedCourse) {
      return res.status(404).json({ error: 'This is not your allocated course.' });
    }

    
    const registeredCourses = await RegisteredCourses.find({
      'courses.courseCode': courseCode
    });

    if (registeredCourses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }


    const StudentIds = registeredCourses.map((course) => {
      console.log(course.StudentId); // Optional: Print the course object for debugging
      return course.StudentId;
    });
    
    // Find the students by student IDs
    const students = await Student.find({ StudentId: { $in: StudentIds } });

    res.json(StudentIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the students.' });
  }
};

// Define a route to retrieve teacher details and course information by TeacherId
const myprofile = async (req, res) => {
  const teacherId = req.TeacherId;
  console.log(teacherId)

  try {
    // Retrieve the teacher by TeacherId
    const teacher = await Teacher.findOne({ TeacherId: teacherId }).exec();

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Retrieve assignments for the teacher
    const assignments = await Assignment.find({ teacherReg: teacherId }).exec();

    // Combine teacher details with assigned courses
    const teacherData = {
      teacherId: teacher.TeacherId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      courses: assignments.map(assignment => assignment.courseCode),
    };

    res.json(teacherData);
  } catch (error) {
    console.error('Error retrieving teacher data', error);
    res.status(500).json({ error: 'Failed to retrieve teacher data' });
  }
};

  export { loginTeacher,markAttendance ,addMarks,updateMarks,deleteMarks,getMarks,myCourses,createQuiz,viewStudents,myprofile};
