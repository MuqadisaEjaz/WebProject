import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer,  TableRow, Paper } from '@mui/material';
import NavBar from '../Navbar.js';
const MyProfileTable = () => {
  const [teacherData, setTeacherData] = useState(null);
  const token = localStorage.getItem('token');
  console.log(token);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4200/api/teacher/myprofile`,{
        headers: {
          'Content-Type': 'application/json',
          token: token,
        }
      });
        const data = await response.json();
        setTeacherData(data);
      } catch (error) {
        console.error('Error retrieving teacher data', error);
      }
    };

    fetchData();
  }, []);

  if (!teacherData) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <NavBar/>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop: '100px', marginLeft:'280px',marginRight:'40px'  }}>
    <TableContainer component={Paper} >
      <Table >
        <TableBody>
        <TableRow>
        <TableCell colSpan={2} style={{ fontSize: '18px', backgroundColor: '#2F4A62', fontWeight: 'bold' ,color: 'white'}}>
          My Profile
        </TableCell>
      </TableRow>
          {Object.entries(teacherData).map(([label, value]) => (
            <TableRow key={label}>
              <TableCell component="th" scope="row">
                {label}
              </TableCell>
              <TableCell> {value} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  </>
);
};

export default MyProfileTable;
