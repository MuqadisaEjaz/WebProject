
import './App.css';


import React, { useState } from 'react';


function App() {

  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const response = await fetch('http://localhost:5000/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        password: password,
      }),
    });
  
    if (response.ok) {
      // login successful
      console.log('Login successful!');

    } else {
      // login failed
      console.log('Login failed!');
    }
    setUsername('');
    setPassword('');
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} >
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" value={name} onChange={handleUsernameChange} /><br /><br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange}/><br /><br />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default App;




