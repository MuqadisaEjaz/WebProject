
import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
    StudentId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true
    },
  },{timestamps: true})

  const Student = mongoose.model('Student', studentSchema);
  export default  Student;
