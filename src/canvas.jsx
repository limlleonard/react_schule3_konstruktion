import React, { useState, useEffect, useRef } from 'react';
import { width, height, zeichnen, resetPoints } from './util';

const Canvas = ({ mode, step }) => {
    // const [points, setPoints] = useState([]);

    const canvasRef = useRef(null);
    // const vars=useRef({});
    // Variable in useEffect definieren, nachdem DOM völlig geladen ist
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas=canvasRef.current;
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        // vars.current = {
        //     FE1: [canvas.width / 2, canvas.height / 2], // Wie man variable in useEffect setzt
        // };
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, width, height);
        zeichnen(ctx, mode, step);
        if (step===-1) {
            resetPoints([]);
        }
    }, [step]); // durchsetzt wenn step sich ändert

    useEffect(() => {
        resetPoints([]);
    }, [mode]);

    return (
        <div className="ctn-r">
          <div className="board" id="board" style={{ width: `${width}px`, height: `${height}px`}}>
            <canvas ref={canvasRef} />
          </div>
        </div>
    );
};

export default Canvas;
