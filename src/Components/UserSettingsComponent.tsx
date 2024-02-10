import React, { useState, ChangeEvent, FormEvent } from 'react';
import CustomInput from './InputField';
import LineDivider from './LineDividerComponent';
import ActionButton from './ActionButton';

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
  const [editedUser, setEditedUser] = useState<UserDTO>({ ...user });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Call the onUpdateUser function with the updated user information
    onUpdateUser(editedUser);
  };

  return (
    <div>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <CustomInput type="text" value={editedUser.fullname} onChange={handleChange}/>
        </label>
        <br />
        <label>
          Email:
          <CustomInput type="email" value={editedUser.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Phone Number:
          <CustomInput type="tel" value={editedUser.phonenumber} onChange={handleChange} />
        </label>
        <br />
        <label>
          Address:
          <CustomInput type="text" value={editedUser.address} onChange={handleChange} />
        </label>
        <br />
        <LineDivider height={1} />
        <label>
          Password:
          <CustomInput type="password" value={editedUser.password} onChange={handleChange} />
        </label>
        <br />
        <ActionButton onClick={handleSubmit}>Submit</ActionButton>
      </form>
    </div>
  );
};

export default SettingsComponent;
