import React, { useState, useEffect } from 'react';
import { vorbereitungen, anweisungen, sumSteps } from './util.ts';

// Defining the props types for the Control component
interface ControlProps {
  onModeChange: (mode: number) => void;
  onStepChange: (step: number) => void;
  onReset: () => void;
}

const Control: React.FC<ControlProps> = ({ onModeChange, onStepChange, onReset }) => {
  // State to track selected array index and current string index
  const [mode, setMode] = useState<number>(0);
  const [step, setStep] = useState<number>(-1);
  const [anweisung, setAnweisung] = useState<string>('');
  const [sumStep, setSumStep] = useState<number>(sumSteps[0]);

  useEffect(() => {
    onModeChange(mode); // Calling onModeChange here to avoid updates during render
  }, [mode]);
  useEffect(() => {
    onStepChange(step);
  }, [step]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = parseInt(e.target.value);
    setMode(mode);
    // onModeChange(mode); // Signal zurück nach App schicken
    setStep(-1);
    setAnweisung('');
    setSumStep(sumSteps[mode]); // Berechnen, in welchem Mode gibt es insgesamt wie viele Steps
  };

  const handleStep = (vorwärts: boolean) => {
    setStep((prevStep) => {
      let newStep: number;
      const lenVor = vorbereitungen[mode]?.length;
      const lenAn = anweisungen[mode]?.length;

      if (vorwärts) {
        newStep = prevStep < sumStep - 1 ? prevStep + 1 : sumStep - 1;
      } else {
        newStep = prevStep > -1 ? prevStep - 1 : -1;
      }

      if (newStep < lenVor) {
        setAnweisung(vorbereitungen[mode][newStep] || '');
      } else {
        setAnweisung(anweisungen[mode]?.[(newStep - lenVor) % lenAn]);
      }
      return newStep;
    });
  };

  const zurücksetzen = () => {
    onReset();
    setStep(-1);
    setAnweisung('');
  };

  return (
    <div className="ctn-l">
      <h1>Konstruktion</h1>
      <div className="ctn-select">
        <label htmlFor="mode">Mode: </label>
        <select name="mode" id="mode" onChange={handleSelect} value={mode}>
          <option value="0">Ellipse</option>
          <option value="1">Hyperbel</option>
          <option value="2">Parabel</option>
        </select>
      </div>
      <div className="ctn-button">
        <button id="rückwärts" onClick={() => handleStep(false)}>
          &lt;&lt;
        </button>
        <button id="vorwärts" onClick={() => handleStep(true)}>
          &gt;&gt;
        </button>
        <button id="zurücksetzen" onClick={() => zurücksetzen()}>
          Zurücksetzen
        </button>
      </div>
      <p>Anweisung:</p>
      <p id="anweisung">{anweisung}</p>
      <a href="https://github.com/limlleonard/react_schule3_konstruktion" target="_blank">Link to source code</a> 
    </div>
  );
};

export default Control;
