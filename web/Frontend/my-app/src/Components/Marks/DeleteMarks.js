import React, { useState, useEffect } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import NavBar from '../../Navbar.js';

const DeleteMarks = () => {
  const [courseCode, setCourseCode] = useState('');
  const [examType, setExamType] = useState('');
  const [studentMarks, setStudentMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');


  const handleFetchMarks = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/marks/${examType}`,{
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });
      if (response.ok) {
        const { studentMarks } = await response.json();
        setStudentMarks(studentMarks);
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

  const handleDeleteMarks = async (StudentId) => {
    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/marks/${examType}/students/${StudentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      });
      if (response.ok) {
        alert('Marks deleted successfully');
        setStudentMarks(studentMarks.filter((student) => student.StudentId !== StudentId));
      } else {
        console.log('Failed to delete marks');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCourseCodeChange = (event) => {
    setStudentMarks([]);
    setCourseCode(event.target.value);
  };

  const handleExamTypeChange = (event) => {
    setExamType(event.target.value);
  };

  
  return (
    <div>
      <NavBar/>
      <form onSubmit={handleFetchMarks}>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '100px', marginLeft:'280px' }}>
          <TextField
            label="Course Code"
            variant="outlined"
            value={courseCode}
            onChange={handleCourseCodeChange}
          />
          <TextField
            label="Exam Type"
            variant="outlined"
            value={examType}
            onChange={handleExamTypeChange}
            style={{ marginLeft: '10px' }}
          />
          <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '10px', backgroundColor: '#2F4A62' }}>
            Fetch Marks
          </Button>
        </div>
      </form>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {studentMarks && studentMarks.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft:'280px',marginRight:'40px' }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead style={{ backgroundColor: '#2F4A62' }}>
                    <TableRow>
                      <TableCell style={{ color: 'white' }}>Student ID</TableCell>
                      <TableCell style={{ color: 'white' }}>Obtained Marks</TableCell>
                      <TableCell style={{ color: 'white' }}>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentMarks.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{student.StudentId}</TableCell>
                        <TableCell>{student.obtainedMarks}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="secondary" style={{ backgroundColor: '#2F4A62' }}
                            onClick={() => handleDeleteMarks(student.StudentId)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <p  style={{ marginTop: '40px', marginLeft:'280px' }} >No marks found for the entered Course Code and Exam Type</p>
          )}
        </>
      )}
    </div>
  );
};

export default DeleteMarks;
