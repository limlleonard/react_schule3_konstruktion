import React, { useState } from 'react';
import Control from './gpt_panel';
import Canvas from './gpt_canvas';

const App = () => {
  const [paramToCanvas, setParamToCanvas] = useState(null); // Parameter to send to Canvas
  const [paramFromCanvas, setParamFromCanvas] = useState(null); // Parameter received from Canvas

  const handleButtonClick = (param) => {
    setParamToCanvas(param); // Set the parameter to be passed to Canvas
  };

  const handleResponseFromCanvas = (response) => {
    setParamFromCanvas(response); // Receive the parameter from Canvas
  };

  return (
    <div>
      <Control 
        onButtonClick={handleButtonClick} 
        paramFromCanvas={paramFromCanvas} 
      />
      <Canvas 
        paramToCanvas={paramToCanvas} 
        onResponse={handleResponseFromCanvas}
      />
    </div>
  );
};

export default App;
