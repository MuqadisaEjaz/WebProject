import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  courseCode: {
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
          StudentId: {
            type: String,
            required: true,
          },
          isPresent: {
            type:String,
            required: true,
          },
        },
      ],
    },
  ],
});

  
const Attendance = mongoose.model("Attendance", attendanceSchema);
  
  export default  Attendance
  