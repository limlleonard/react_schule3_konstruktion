import React, { useRef, useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [mode, setMode] = useState(0); // Mode: 0-Ellipse, 1-Hyperbole, 2-Parabola
  const [currentStep, setCurrentStep] = useState(-1);
  const [points, setPoints] = useState([]);

  const canvasRef = useRef(null);

  const handleModeChange = (event) => {
    setMode(Number(event.target.value));
    resetCanvas();
  };

  const resetCanvas = () => {
    setCurrentStep(-1);
    setPoints([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize canvas size
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    // Utility functions
    const drawPoint = (ctx, [x, y], color = 'white', radius = 5) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawLine = (ctx, [x1, y1], [x2, y2], color = 'white') => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    const drawCircle = (ctx, [x, y], radius, color = 'white') => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    // Render shapes based on mode and current step
    const renderShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 0) {
        // Example for Ellipse
        drawCircle(ctx, [canvas.width / 2, canvas.height / 2], 100, 'white');
      } else if (mode === 1) {
        // Example for Hyperbole
        drawLine(ctx, [0, 0], [canvas.width, canvas.height], 'red');
      } else if (mode === 2) {
        // Example for Parabola
        for (let x = -100; x <= 100; x++) {
          const y = x * x / 100;
          drawPoint(ctx, [canvas.width / 2 + x, canvas.height / 2 - y], 'blue', 2);
        }
      }
    };

    renderShapes();
  }, [mode, currentStep, points]);

  return (
    <div className="app">
      <header>
        <h1>Geometric Shapes Visualization</h1>
      </header>
      <div className="controls">
        <label htmlFor="mode-select">Choose Mode:</label>
        <select id="mode-select" value={mode} onChange={handleModeChange}>
          <option value={0}>Ellipse</option>
          <option value={1}>Hyperbole</option>
          <option value={2}>Parabola</option>
        </select>
        <button onClick={resetCanvas} className="reset-btn">Reset</button>
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid white', background: 'black' }}></canvas>
      <button onClick={handleNextStep} className="next-step-btn">Next Step</button>
    </div>
  );
};

export default App;
