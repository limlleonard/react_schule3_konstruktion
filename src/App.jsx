import { useState } from 'react'
import './App.css'
import Control from './control';
import Canvas from './canvas';

// xxx punkte sind beim Mode ändern und zurücksetzen nicht zurückgesetzt werden
function App() {
  const [mode, setMode] = useState(0); // Mode: 0-Ellipse, 1-Hyperbole, 2-Parabola
  const [step, setStep] = useState(-1);

  const handleModeChange = (mode) => {
    setMode(mode);
    setStep(-1);
  };

  const handleStepChange = (step) => {
    setStep(step);
  };

  const handleReset = () => {
    setStep(-1);
  };

  return (
    <div className='ctn0'>
    <Control onModeChange={handleModeChange} onStepChange={handleStepChange} onReset={handleReset} />
    <Canvas mode={mode} step={step}/>
    </div>
  )
}

export default App