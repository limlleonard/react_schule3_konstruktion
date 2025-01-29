import React, { useState } from 'react';
import { vorbereitungen, anweisungen, sumSteps } from './util';

const Control = ({ onModeChange, onStepChange, onReset }) => {
    // State to track selected array index and current string index
    const [mode, setMode] = useState(0);
    const [currentStep, setStep] = useState(-1);
    const [anweisung, setAnweisung] = useState('');
    const [sumStep, setSumStep]=useState(sumSteps[0]);

    const handleSelect = (e) => {
        const mode = parseInt(e.target.value);
        onModeChange(mode); // Signal zurück nach App schicken
        setMode(mode);
        setStep(-1); // Reset to the first string in the selected subarray
        setAnweisung('');
        setSumStep(sumSteps[mode]); // Berechnen, in welchem Mode gibt es ingesamt wie viele Steps
    };
    const handleStep = (vorwärts) => {
        setStep((prevIndex) => {
            let newIndex;
            const lenVor=vorbereitungen[mode]?.length;
            const lenAn=anweisungen[mode]?.length;
            if (vorwärts) {
                newIndex = prevIndex < sumStep-1 ? prevIndex+1:sumStep-1;
            } else {
                newIndex = prevIndex > -1 ? prevIndex - 1 : -1;
            }
            if (newIndex < lenVor) {
                setAnweisung(vorbereitungen[mode][newIndex] || '')
            } else {
                setAnweisung(anweisungen[mode]?.[(newIndex - lenVor)%lenAn])
            }
            onStepChange(newIndex);
            return newIndex;
        });
    }
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
        </div>
    );
};

export default Control;
