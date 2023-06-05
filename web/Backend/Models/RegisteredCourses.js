import mongoose from 'mongoose'

const RegisteredCourseSchema = new mongoose.Schema({
  StudentId: {
    type: String,
    //ref: 'Student',
    required: true
  },
  courses: [
    {
      courseCode: {
        type: String,
        required: true
      },
      courseName: {
        type: String,
        required: true
      }
    }
  ]
});


const RegisteredCourses = mongoose.model('RegisteredCourses', RegisteredCourseSchema);
  
export default  RegisteredCourses