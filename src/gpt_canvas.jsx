import React, { useEffect } from 'react';

const Canvas = ({ paramToCanvas, onResponse }) => {
  useEffect(() => {
    if (paramToCanvas) {
      console.log(`Received from ControlPanel: ${paramToCanvas}`);
      const response = `${paramToCanvas} Processed`; // Example response
      onResponse(response); // Send response back to ControlPanel
    }
  }, [paramToCanvas, onResponse]);

  return (
    <div>
      <p>Canvas Component</p>
    </div>
  );
};

export default Canvas;