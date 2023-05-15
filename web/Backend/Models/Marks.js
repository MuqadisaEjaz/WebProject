import mongoose from 'mongoose'
const marksSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  marks: [
    {
      examType: {
        type: String,
        required: true,
      },
      totalMarks: {
        type: Number,
        required: true,
      },
      studentMarks: [
        {
          studentId: {
            type: String,
            required: true,
          },
          obtainedMarks: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});




const Marks = mongoose.model('Marks', marksSchema);
  
export default  Marks