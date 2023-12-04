import React, { useEffect, useState } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import NavBar from '../../Navbar.js';

import { Select, MenuItem } from '@mui/material';
const AddMarksForm = () => {
  const [courseCode, setCourseCode] = useState('');
  const [examType, setExamType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');


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
        const extractedStudentIds = studentsData.map((studentId) => ({
          StudentId: studentId,
          obtainedMarks: ''
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

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const added = students.some((student) => student.obtainedMarks === '');
    if (added) {
      alert('Please add marks for all students.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/marks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({
          examType,
          totalMarks,
          students,
        }),
      });

      if (response.ok) {
        alert('Marks added successfully');
      } else {
        const responseData = await response.json();
        alert(responseData.error);
      }
    } catch (error) {
      console.error(error);
    }
  };



  const handleCourseCodeChange = (event) => {
    setStudents([])
    setCourseCode(event.target.value);
  };

  const handleExamTypeChange = (event) => {
    setExamType(event.target.value);
  };

  const handleTotalMarksChange = (event) => {
    setTotalMarks(event.target.value);
  };

  const handleStudentChange = (index, event) => {
    const updatedStudents = [...students];
    updatedStudents[index] = {
      ...updatedStudents[index],
      obtainedMarks: event.target.value,
    };
    setStudents(updatedStudents);
  };

  const handleViewStudents = (event) => {
    event.preventDefault();
    setLoading(true);
  };


  return (
    <>
    <NavBar/>
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'center',marginTop: '100px', marginLeft:'280px'  }}>
        <TextField
          label="Course ID"
          variant="outlined"
          value={courseCode}
          onChange={handleCourseCodeChange}
        />
        <Button variant="contained" color="primary" onClick={handleViewStudents} style={{ marginLeft: '10px', backgroundColor: '#2F4A62' }}>
          View Students
        </Button>
        <Select
            label="Exam Type"
            variant="outlined"
            value={examType}
            onChange={handleExamTypeChange}
            style={{ marginLeft: '10px' }}
          >
            <MenuItem value="Final">Final</MenuItem>
          </Select>
        <TextField
          label="Total Marks"
          variant="outlined"
          type="number"
          value={totalMarks}
          onChange={handleTotalMarksChange}
          style={{ marginLeft: '10px' }}
        />

      </div>
      <br />
      {students.length > 0 ? (
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop: '40px', marginLeft:'280px',marginRight:'40px'  }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: '#2F4A62' }}>
                <TableRow>
                  <TableCell style={{ color: 'white' }}>Student ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Obtained Marks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.StudentId}</TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        type="number"
                        value={student.obtainedMarks}
                        onChange={(event) => handleStudentChange(index, event)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px', backgroundColor: '#2F4A62' }}>
            Add Marks
          </Button>
        </div>
      ) : (
        <p style={{ marginTop: '40px', marginLeft:'280px' }}>No students found for the entered Course ID</p>
      )}
    </form>
    </>
  );
};


export default AddMarksForm;
