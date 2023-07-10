import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Blog from './Blog';

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegistration = () => {
    const payload = {
      username: username,
      password: password
    };

    axios.post('http://127.0.0.1:8000/api/register/', payload)
      .then(response => {
        setSuccessMessage('Registration successful!');
        setErrorMessage('');
      })
      .catch(error => {
        setErrorMessage('Registration failed. Please try again.');
        setSuccessMessage('');
      });
  };

  const handleLoginNavigation = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>User Registration</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button onClick={handleRegistration}>Register</button>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Already a user?</h2>
      <button onClick={handleLoginNavigation}>Login</button>
    </div>
  );
}

function App() {
  const isLoggedIn = localStorage.getItem('access_token') !== null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/blog" element={isLoggedIn ? <Blog /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more routes for other components/pages */}
      </Routes>
    </Router>
  );
}

export default App;
