import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";

const  app = express();
import cors from "cors";

mongoose.connect("mongodb+srv://aimen:aimen123@cluster0.cjosamv.mongodb.net/blockchain")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


  app.use(express.static("public"));
  app.use(express.json()); //important for recieving api calls
  app.use(cors())


//Routes  
import TeacherRoute from './Routes/Teacher.js'
  app.use('/api/teacher',TeacherRoute)


app.listen(4200, () => {
  console.log("Server started on port 4200");
});



