import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  onClear?: () => void;
  label?: string;
  required?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  onClear,
  label = 'Signature',
  required = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing style
    context.strokeStyle = '#0B2545';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    setCtx(context);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);

    // Auto-save signature after drawing
    if (!isEmpty) {
      handleSave();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    if (onClear) {
      onClear();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const signatureData = canvas.toDataURL('image/png');
    onSave(signatureData);
  };

  return (
    <div className="signature-pad-container">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border-2 border-gray-300 rounded-lg w-full h-40 bg-white cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-sm">Sign here</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={isEmpty}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>

        <p className="text-xs text-gray-500">
          {isEmpty ? 'Draw your signature above' : 'Signature captured'}
        </p>
      </div>
    </div>
  );
};

export default SignaturePad;
