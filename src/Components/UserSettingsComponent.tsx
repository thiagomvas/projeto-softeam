import React, { useState, ChangeEvent, FormEvent } from 'react';
import './../Styles/InputField.css';
import LineDivider from './LineDividerComponent';
import ActionButton from './ActionButton';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

type UserDTO = {
  id: string;
  fullname: string;
  password: string;
  email: string;
  role: string;
  phonenumber: string;
  address: string;
};

interface SettingsProps {
  user: UserDTO;
  onUpdateUser: (updatedUser: UserDTO) => void;
}

const SettingsComponent: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const location = useLocation();
  const [fullname, setFullname] = useState<string>(user.fullname);
  const [password, setPassword] = useState<string>(user.password);
  const [email, setEmail] = useState<string>(user.email);
  const [role, setRole] = useState<string>(user.role);
  const [phonenumber, setPhonenumber] = useState<string>(user.phonenumber);
  const [address, setAddress] = useState<string>(user.address);

  const confirmDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      const response = await axios.delete(
        `http://localhost:3001/api/data/users/${user.id}`,
        { headers: { Authorization: `${location.state.token}` } }
      );

      console.log(response.data); // Log the success message or handle accordingly

    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    var newUser = {
      id: user.id,
      fullname: fullname,
      password: password === '' ? user.password : password,
      email: email,
      role: role,
      phonenumber: phonenumber,
      address: address,
    };

    onUpdateUser(newUser);
  };

  return (
    <div>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input className='input-field' type="text" value={fullname} onChange={(e) => setFullname(e.target.value)}/>
        </label>
        <br />
        <label>
          Email:
          <input className='input-field'  type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Phone Number:
          <input className='input-field'  type="tel" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />
        </label>
        <br />
        <label>
          Address:
          <input className='input-field'  type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <br />
        <LineDivider height={1} />
        <label>
          Password:
          <input className='input-field'  type="password" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <ActionButton onClick={handleSubmit}>Submit</ActionButton>
        <ActionButton onClick={confirmDelete}>Delete Account</ActionButton>
      </form>
    </div>
  );
};

export default SettingsComponent;
