import React, { useState, useEffect, useRef } from 'react';
import { width, height, zeichnen, resetPoints } from './util.ts';

interface CanvasProps { // xxts
  mode: number;
  step: number;
}

const Canvas: React.FC<CanvasProps> = ({ mode, step }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement?.offsetWidth ?? 0; // xxts
    canvas.height = canvas.parentElement?.offsetHeight ?? 0;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      zeichnen(ctx, mode, step);
      if (step === -1) {
        resetPoints();
      }
    }
  }, [step]); // Re-run when `step` changes

  useEffect(() => {
    resetPoints();
  }, [mode]);

  return (
    <div className="ctn-r">
      <div className="board" id="board" style={{ width: `${width}px`, height: `${height}px` }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
