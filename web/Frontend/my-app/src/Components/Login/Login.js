import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, Typography } from '@mui/material';

function Login() {
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleTeacherIdChange = (event) => {
    setTeacherId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:4200/api/teacher/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        TeacherId: teacherId,
        password: password,
      }),
    });

    if (response.ok) {
      // login successful
      const data = await response.json();
      const token = data.token; // Assuming the API response includes a token field

      // Store the token in local storage
      localStorage.setItem('token', token);
      console.log(token);
      console.log('Login successful!');
      navigate('/homepage'); // Navigate to the desired route after successful login
    } else {
      // login failed
      console.log('Login failed!');
    }

    setTeacherId('');
    setPassword('');
  };

  return (
    <div>
      <Container component="main" maxWidth="md">
        <div style={{ marginTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Grid container>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src="https://www.pockethrms.com/wp-content/uploads/2023/03/Training-Management-made-Effortless.jpg" alt="Logo" style={{ width: '100%', height: 'auto', maxWidth: '800px', maxHeight: '400px' }} />
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography component="h1" variant="h5" style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold' }}>
                Welcome To LMS
              </Typography>
              <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="teacherId"
                  label="Teacher ID"
                  name="teacherId"
                  value={teacherId}
                  onChange={handleTeacherIdChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px', backgroundColor: '#2F4A62' }}>
                  Login
                </Button>
              </form>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default Login;
