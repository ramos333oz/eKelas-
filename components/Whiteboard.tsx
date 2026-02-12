import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pencil, Trash2, Undo } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
  isEraser?: boolean;
}

export const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [color, setColor] = useState('#ffffff');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    // Resize canvas to fit container
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Redraw all strokes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    [...strokes, currentStroke].forEach(stroke => {
      if (!stroke) return;
      ctx.beginPath();
      
      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = stroke.width;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }

      if (stroke.points.length > 0) {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach(p => ctx.lineTo(p.x, p.y));
      }
      ctx.stroke();
    });
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

  }, [strokes, currentStroke, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentStroke({
      points: [pos],
      color: tool === 'eraser' ? '#000000' : color, 
      width: tool === 'eraser' ? 20 : 3,
      isEraser: tool === 'eraser'
    });
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    const pos = getPos(e);
    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, pos]
    });
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke) {
      setStrokes([...strokes, currentStroke]);
      setCurrentStroke(null);
    }
    setIsDrawing(false);
  };

  return (
    <div className="flex flex-col h-full w-full" ref={containerRef}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-2 p-1 bg-slate-800 rounded-lg w-max mx-auto shadow-sm">
        <button 
          onClick={() => setTool('pen')}
          className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
        >
          <Eraser size={18} />
        </button>
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <input 
          type="color" 
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
        />
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <button 
          onClick={() => setStrokes(strokes.slice(0, -1))}
          className="p-2 rounded text-slate-400 hover:bg-slate-700"
        >
          <Undo size={18} />
        </button>
        <button 
          onClick={() => setStrokes([])}
          className="p-2 rounded text-slate-400 hover:bg-slate-700 hover:text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-slate-900 rounded-lg border border-slate-700 overflow-hidden cursor-crosshair bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none"
        />
      </div>
    </div>
  );
};