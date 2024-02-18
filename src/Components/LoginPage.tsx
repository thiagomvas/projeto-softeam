// LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/InputField.css';
import ActionButton from './ActionButton';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:3001/api/auth/login', { username: username, password: password })
      .then(response => {
        if (response.data.success) {
          console.log(`Login successful.`);
          navigate('/userpage', {
            state: {
              token: response.data.token,
            }
          });
        } else {
          setError('Login failed. Please check your credentials.');
        }
      })
      .catch(error => {
        console.error('Error during login:', error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input
          className='input-field'
          style={{ width: '200px'}}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
          className='input-field'
          style={{ width: '200px'}}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="action-button" type="button" onClick={handleLogin}>
          Login
        </button>
        <button className="action-button" type="button" onClick={() => navigate('/register')}>
          Registrar
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
