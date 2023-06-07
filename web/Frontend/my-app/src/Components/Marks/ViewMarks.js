import React, { useEffect, useState } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import NavBar from '../../Navbar.js';
const ViewMarksForm = () => {
  const [courseCode, setcourseCode] = useState('');
  const [examType, setExamType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [studentMarks, setStudentMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');


  useEffect(() => {
    if (courseCode && examType && loading) {
      fetchStudentMarks();
    }
  }, [courseCode, examType, loading]);

  const fetchStudentMarks = async () => {
    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/marks/${examType}`,{
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });
      if (response.ok) {
        const marksData = await response.json();
        const { totalMarks, studentMarks } = marksData;
        setTotalMarks(totalMarks);
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

  const handlecourseCodeChange = (event) => {
    setTotalMarks('');
    setStudentMarks([]);
    setcourseCode(event.target.value);
  };

  const handleExamTypeChange = (event) => {
    setTotalMarks('');
    setStudentMarks([]);
    setExamType(event.target.value);
  };

  const handleViewMarks = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  return (
    <>
    <NavBar/>
    <form>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '100px', marginLeft:'280px'  }}>
        <TextField
          label="Course ID"
          variant="outlined"
          value={courseCode}
          onChange={handlecourseCodeChange}
        />
        <TextField
          label="Exam Type"
          variant="outlined"
          value={examType}
          onChange={handleExamTypeChange}
          style={{ marginLeft: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewMarks}
          style={{ marginLeft: '10px', backgroundColor: '#2F4A62' }}
        >
          View Marks
        </Button>
      </div>
      <br />
      {totalMarks && studentMarks.length > 0 ? (
        <>
          <p style={{ marginTop: '40px', marginLeft:'280px' }}>Total Marks: {totalMarks}</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop: '40px', marginLeft:'280px',marginRight:'40px'  }}>
          <TableContainer component={Paper} >
            <Table>
              <TableHead style={{ backgroundColor: '#2F4A62' }}>
                <TableRow>
                  <TableCell style={{ color: 'white' }}>Student ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Obtained Marks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentMarks.map((student, index) =>(
                  <TableRow key={index}>
                    <TableCell>{student.StudentId}</TableCell>
                    <TableCell>{student.obtainedMarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </div>
        </>
      ) : (
        <p style={{ marginTop: '40px', marginLeft:'280px' }}>No student marks found for the entered Course ID and Exam Type</p>
      )}
    </form>
    </>
  );
};

export default ViewMarksForm;
