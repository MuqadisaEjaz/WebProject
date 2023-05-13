import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";

const  app = express();
import cors from "cors";

mongoose.connect("mongodb+srv://Muqadisa:muqadisa1@cluster0.t4cixon.mongodb.net/LMS")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


  app.use(express.static("public"));
  app.use(express.json()); //important for recieving api calls
  app.use(cors())


//Routes  
import TeacherRoute from './Routes/Teacher.js'
  app.use('/api/user',TeacherRoute)


app.listen(4200, () => {
  console.log("Server started on port 4200");
});
