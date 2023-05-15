import mongoose from 'mongoose';

const assignmentSchema = mongoose.Schema({
  teacherReg: {
    type: String,
    required: true,
  },
  courseCode: {
    type: [String],
    required: true,
  },

});

//assignmentSchema.index({ teacherReg: 1, courseCodes: 1 }, { unique: true });
const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
