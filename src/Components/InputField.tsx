import React, { useState, ChangeEvent } from 'react';
import './../Styles/InputField.css';

interface InputFieldProps {
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ type, value, onChange, placeholder }) => {

  return (
    <input
    className='input-field'
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default InputField;