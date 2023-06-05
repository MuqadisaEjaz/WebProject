import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import AddMarksForm from '../src/Components/Marks/AddMarks.js';
import UpdateMarks from './Components/Marks/UpdateMarks.js';
import ViewMarksForm from './Components/Marks/ViewMarks.js';
import DeleteMarks from './Components/Marks/DeleteMarks.js';
import Attendance from './Components/Attendance/MarkAttendance.js';
import Login from './Components/Login/Login.js';
import Quiz from '../src/quiz.js'
import MyProfileTable from './Profile/Profile.js';

const MainApp = () => {
  return (
   // <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<MyProfileTable />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/addmarks" element={<AddMarksForm />} />
            <Route path="/deletemarks" element={<DeleteMarks />} />
            <Route path="/viewmarks" element={<ViewMarksForm />} />
            <Route path="/updatemarks" element={<UpdateMarks />} />
            <Route path="/markattendance" element={<Attendance />} />
        </Routes>
      </div>
    //</Router>
  );
};

export default MainApp;
