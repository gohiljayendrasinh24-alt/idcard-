import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, X } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
  isEn?: boolean;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isEn = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inkColor, setInkColor] = useState('#0f2744'); // Royal navy ink

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = inkColor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = inkColor;
      }
    }
  }, [inkColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900 text-sm">
              {isEn ? 'Draw Principal Signature' : 'આચાર્યશ્રીની ડિજિટલ સહી કરો'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-5 flex flex-col items-center">
          <div className="w-full relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={380}
              height={160}
              className="touch-none w-full h-40 cursor-crosshair bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {/* Guide baseline */}
            <div className="absolute bottom-8 left-6 right-6 border-b border-slate-200 pointer-events-none flex justify-between">
              <span className="text-[10px] text-slate-400 font-medium">સહી રેખા / Sign line</span>
            </div>
          </div>

          {/* Ink color picker */}
          <div className="mt-3 flex items-center justify-between w-full text-xs text-slate-600">
            <span>{isEn ? 'Ink Color:' : 'શાહીનો રંગ:'}</span>
            <div className="flex items-center gap-2">
              {[
                { color: '#0f2744', label: 'Navy Blue' },
                { color: '#1e3a8a', label: 'Royal Blue' },
                { color: '#111827', label: 'Black' },
              ].map((ink) => (
                <button
                  key={ink.color}
                  onClick={() => setInkColor(ink.color)}
                  style={{ backgroundColor: ink.color }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    inkColor === ink.color ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : 'hover:scale-105'
                  }`}
                  title={ink.label}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-between w-full">
            <button
              onClick={clearCanvas}
              className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Clear' : 'સાફ કરો'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium"
              >
                {isEn ? 'Cancel' : 'રદ કરો'}
              </button>
              <button
                onClick={saveSignature}
                disabled={!hasDrawn}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEn ? 'Apply Signature' : 'સહી ઉમેરો'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
