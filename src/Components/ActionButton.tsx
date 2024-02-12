import React, { MouseEventHandler, ReactNode } from 'react';
import './../Styles/ActionButton.css'; // Assuming you have a CSS file for styling

interface CustomButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const ActionButton: React.FC<CustomButtonProps> = ({ onClick, children }) => {
  return (
    <button
      className="action-button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ActionButton;
