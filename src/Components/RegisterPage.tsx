// LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = () => {
    axios.post('http://localhost:3001/api/auth/register', { 
      username: username, 
      password: password, 
      fullname: fullname,
      email: email,
      address: address,
      phonenumber: phonenumber})
      .then(response => {
        if (response.data.success) {
          console.log(`Register successful`);
          navigate('/login');
        } else {
          console.log('Register failed. ');
        }
      })
      .catch(error => {
        console.error('Error during register:', error);
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fullname">Full Name:</label>
          <input
          className='input-field'
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">E-Mail:</label>
          <input
          className='input-field'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
          className='input-field'
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <input
          className='input-field'
            type="tel"
            id="phonenumber"
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button className='action-button' type="button" onClick={handleRegister}>
          Register
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
