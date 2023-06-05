import React, { useEffect, useState } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UpdateMarks = () => {
  const [courseCode, setcourseCode] = useState('');
  const [examType, setExamType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [studentMarks, setStudentMarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlecourseCodeChange = (event) => {
    setStudentMarks([])
    setcourseCode(event.target.value);
  };

  const handleExamTypeChange = (event) => {
    setExamType(event.target.value);
  };

//   useEffect(() => {
//     if (courseCode && examType && loading) {
//         fetchMarks();
//     }
//   }, [courseCode, examType, loading]);


  const fetchMarks = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/marks/${examType}`);
      if (response.ok) {
        const { totalMarks, studentMarks } = await response.json();
        setTotalMarks(totalMarks);
        setStudentMarks(studentMarks);
      } else {
        console.log('Failed to fetch marks');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleStudentMarksChange = (index, event) => {
    const updatedStudentMarks = [...studentMarks];
    updatedStudentMarks[index] = {
      ...updatedStudentMarks[index],
      obtainedMarks: event.target.value,
    };
    setStudentMarks(updatedStudentMarks);
  };


  const UpdateStudentMarks = async () => {
    const token = localStorage.getItem('token');
    console.log(token);

    try {
      const response = await fetch(`http://localhost:4200/api/teacher/courses/${courseCode}/marks/${examType}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            token: token,
          },
        body: JSON.stringify({
          studentMarks,
        }),
      });

      if (response.ok) {
        alert('Marks updated successfully');
      } else {
        console.log('Failed to update marks');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={fetchMarks}>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px', marginLeft:'280px' }}>
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
          <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '10px', backgroundColor: '#2F4A62' }}>
            Fetch Marks
          </Button>
        </div>
      </form>
      <br />

      {loading ? (
        <p>Loading...</p>
      ) : studentMarks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop: '40px', marginLeft:'280px',marginRight:'40px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: '#2F4A62' }}>
                <TableRow>
                  <TableCell style={{ color: 'white' }}>Student ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Obtained Marks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentMarks.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.StudentId}</TableCell>
                    <TableCell>
                      <TextField
                        variant="outlined"
                        type="number"
                        value={student.obtainedMarks}
                        onChange={(event) => handleStudentMarksChange(index, event)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <Button variant="contained" color="primary" onClick={UpdateStudentMarks} style={{ marginTop: '10px', backgroundColor: '#2F4A62' }}>
            Update Marks
          </Button>
        </div>
      ) : (
        <p style={{ marginTop: '40px', marginLeft:'280px' }}>No marks found for the entered Course ID and Exam Type</p>
      )}
    </div>
  );
};

export default UpdateMarks;
