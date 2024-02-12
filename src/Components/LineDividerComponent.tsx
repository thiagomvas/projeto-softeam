import React from 'react';

interface LineDividerProps {
  height: number;
}

const LineDivider: React.FC<LineDividerProps> = ({ height }) => {
  const dividerStyle: React.CSSProperties = {
    width: '100%',
    height: `${height}px`,
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    margin: '10px 0',
  };

  return <div style={dividerStyle}></div>;
};

export default LineDivider;
