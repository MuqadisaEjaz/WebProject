
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, TextField, Button, Typography } from '@mui/material';
import '../Login/Login.css'

function Login() {
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleDisableNavigation = (e) => {
      e.preventDefault();
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handleDisableNavigation);

    return () => {
      window.removeEventListener('popstate', handleDisableNavigation);
    };
  }, []);

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
      const token = data.token;

      // Store the token in local storage
      localStorage.setItem('token', token);
      console.log(token);
      console.log('Login successful!');
      navigate('/homepage');
    } else {
      // login failed
      alert('Login failed!');
    }

    setTeacherId('');
    setPassword('');
  };

  return (
    <div>
      <Container component="main" maxWidth="md">
        <div className="container">
          <Grid container>
            <Grid item xs={6} className="logo-container">
              <img src="https://www.pockethrms.com/wp-content/uploads/2023/03/Training-Management-made-Effortless.jpg" alt="Logo" className="logo-image" />
            </Grid>
            <Grid item xs={6} className="content-container">
              <Typography component="h1" variant="h5" className="title">
                Welcome To LMS
              </Typography>
              <form onSubmit={handleSubmit} className="form">
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
                <Button type="submit" fullWidth variant="contained" color="primary" className="submit-button" style={{ backgroundColor: '#2F4A62' }}>
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
