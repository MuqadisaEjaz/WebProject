import mongoose from 'mongoose'

const RegisteredCourseSchema = new mongoose.Schema({
  StudentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
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


const RegisteredCourse = mongoose.model('RegisteredCourse', RegisteredCourseSchema);
  
export default  RegisteredCourse