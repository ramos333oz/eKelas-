import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, GripHorizontal, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface FloatingWindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  children: React.ReactNode;
}

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
  windowState,
  onClose,
  onMinimize,
  onFocus,
  onResize,
  children
}) => {
  const controls = useDragControls();

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Capture initial values
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowState.size.width;
    const startHeight = windowState.size.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
        moveEvent.preventDefault();
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        onResize(
            windowState.id, 
            Math.max(200, startWidth + deltaX), // Min width
            Math.max(150, startHeight + deltaY) // Min height
        );
    };

    const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Calculate approximate header height to animate to/from to avoid layout jumps
  // Header: py-3 (12px*2) + border (1px) + line-height (24px) ≈ 49px. 
  // Using 50px for a clean rounded value.
  const MINIMIZED_HEIGHT = 50;

  return (
    <motion.div
      layoutId={`window-${windowState.id}`}
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={() => onFocus(windowState.id)}
      initial={{ 
        x: windowState.position.x, 
        y: windowState.position.y, 
        scale: 0.9, 
        opacity: 0 
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        zIndex: windowState.zIndex,
        height: windowState.isMinimized ? MINIMIZED_HEIGHT : windowState.size.height,
        width: windowState.size.width
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      style={{
        position: 'absolute',
        left: 0, 
        top: 0,
        zIndex: windowState.zIndex
      }}
      className="flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10"
    >
      {/* Title Bar */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700 cursor-grab active:cursor-grabbing select-none h-[50px]"
        onPointerDown={(e) => controls.start(e)}
        onDoubleClick={() => onMinimize(windowState.id)}
      >
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <GripHorizontal size={16} className="text-slate-500" />
          {windowState.title}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
          >
            {windowState.isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
            className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 relative">
        {children}
      </div>

      {/* Resize Handle */}
      <div 
        onPointerDown={handleResizePointerDown}
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize opacity-50 hover:opacity-100 z-50 flex items-center justify-center group"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 w-4 h-4 group-hover:text-white transition-colors">
          <path d="M21 15L15 21M21 8L8 21" />
        </svg>
      </div>
    </motion.div>
  );
};