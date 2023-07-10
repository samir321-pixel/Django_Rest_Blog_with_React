import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = () => {
    const payload = {
      username: username,
      password: password
    };

    axios.post('http://127.0.0.1:8000/api/token/', payload)
      .then(response => {
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        setErrorMessage('');
        navigate('/blog'); // Redirect to the blog page
      })
      .catch(error => {
        setErrorMessage('Login failed. Please check your credentials.');
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
