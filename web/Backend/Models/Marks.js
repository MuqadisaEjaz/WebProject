import mongoose from 'mongoose'
const marksSchema = new mongoose.Schema({
  courseCode: {
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
          StudentId: {
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