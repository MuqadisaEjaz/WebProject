import mongoose from 'mongoose'

// const attendanceSchema = new mongoose.Schema({
//   courseId: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   attendanceList: [
//     {
//       studentId: {
//         type: String,
//         required: true,
//       },
//       isPresent: {
//         type: Boolean,
//         required: true,
//       },
//     },
//   ],
// });

// attendanceSchema.js

const attendanceSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  attendanceRecords: [
    {
      date: {
        type: Date,
        required: true,
      },
      attendanceList: [
        {
          studentId: {
            type: String,
            required: true,
          },
          isPresent: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
});

  
const Attendance = mongoose.model("Attendance", attendanceSchema);
  
  export default  Attendance
  