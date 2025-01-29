import React from 'react';

const control = ({ onButtonClick, paramFromCanvas }) => {
  const handleClick = () => {
    const param = "Hello Canvas"; // Example parameter
    onButtonClick(param);
  };

  return (
    <div>
      <button onClick={handleClick}>Send to Canvas</button>
      {paramFromCanvas && <p>Received from Canvas: {paramFromCanvas}</p>}
    </div>
  );
};

export default control;
