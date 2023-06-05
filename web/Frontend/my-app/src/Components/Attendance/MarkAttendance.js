import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem
} from '@mui/material';
import NavBar from '../../Navbar.js';

const AttendanceForm = () => {
  const [courseCode, setCourseCode] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const token = localStorage.getItem('token');
  console.log(token);
  
  useEffect(() => {
    if (courseCode && loading) {
      fetchStudents();
    }
  }, [courseCode, loading]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost:4200/api/teacher/viewStudents/${courseCode}`,{
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });
      if (response.ok) {
        const studentsData = await response.json();
        const extractedStudentIds = studentsData.map((StudentId) => ({
          StudentId,
          isPresent: ''
        }));
        setStudents(extractedStudentIds);
      } else {
         const responseData = await response.json();
         alert(responseData.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCodeChange = (event) => {
    setStudents([]);
    setCourseCode(event.target.value);
  };

  const handleViewStudents = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  const handleAttendanceChange = (index, event) => {
    const updatedStudents = [...students];
    updatedStudents[index] = {
      ...updatedStudents[index],
      isPresent: event.target.value
    };
    setStudents(updatedStudents);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleMarkAttendance = async (event) => {
    event.preventDefault();
    const isAttendanceIncomplete = students.some((student) => student.isPresent === '');
    if (isAttendanceIncomplete) {
      alert('Please mark attendance for all students.');
      return;
    }
    const requestBody = {
      courseCode,
      date: selectedDate,
      attendanceList: students
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify(requestBody)
      });
      if (response.ok) {
        alert('Attendance marked successfully');
        setCourseCode('');
        setStudents([]);
        setSelectedDate('');
      } else {
        const responseData = await response.json();
        alert(responseData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <NavBar/>
    <form onSubmit={handleMarkAttendance}>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft:'280px'  }}>
        <TextField
          label="Course Code"
          variant="outlined"
          value={courseCode}
          onChange={handleCourseCodeChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewStudents}
          style={{ marginLeft: '10px', backgroundColor: '#2F4A62' }}
        >
          View Students
        </Button>
        <div  style={{ marginLeft: '10px'}}>
          <TextField 
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>
      </div>
      <br />
      {students.length > 0 ? (
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' ,marginTop: '40px', marginLeft:'280px',marginRight:'40px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#2F4A62' }}>
              <TableRow>
                <TableCell style={{ color: 'white' }}>Student ID</TableCell>
                <TableCell style={{ color: 'white' }}>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.StudentId}</TableCell>
                  <TableCell>
                    <Select
                      value={student.isPresent}
                      onChange={(event) => handleAttendanceChange(index, event)}
                    >
                      <MenuItem value="A">A</MenuItem>
                      <MenuItem value="P">P</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '10px', backgroundColor: '#2F4A62' }}
          >
            Mark Attendance
          </Button>
        </div>
      ) : (
        <p  style={{ marginTop: '40px', marginLeft:'280px' }}>No students found for the entered Course Code</p>
      )}
    </form>
    </>
  );
};

export default AttendanceForm;
