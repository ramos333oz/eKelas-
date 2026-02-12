import React, { useState } from 'react';
import { Bold, Italic, Type, AlignLeft, AlignCenter, AlignRight, Minus, Plus } from 'lucide-react';

export const NotesContent: React.FC = () => {
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  return (
    <div className="flex flex-col h-full w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-2 p-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg w-full overflow-x-auto shadow-sm no-scrollbar backdrop-blur-sm">
        {/* Font Family */}
        <div className="relative group">
            <Type size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-slate-900/50 text-slate-200 text-xs rounded pl-7 pr-2 py-1.5 border border-transparent hover:border-slate-600 outline-none cursor-pointer appearance-none min-w-[80px]"
            >
            <option value="font-sans">Sans</option>
            <option value="font-serif">Serif</option>
            <option value="font-mono">Mono</option>
            </select>
        </div>

        <div className="w-px h-4 bg-slate-700/50 mx-1" />

        {/* Font Size */}
        <button onClick={() => setFontSize(Math.max(10, fontSize - 2))} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
          <Minus size={14} />
        </button>
        <span className="text-xs text-slate-300 w-6 text-center font-mono">{fontSize}</span>
        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
          <Plus size={14} />
        </button>

        <div className="w-px h-4 bg-slate-700/50 mx-1" />

        {/* Styles */}
        <button
          onClick={() => setIsBold(!isBold)}
          className={`p-1.5 rounded transition-colors ${isBold ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => setIsItalic(!isItalic)}
          className={`p-1.5 rounded transition-colors ${isItalic ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          title="Italic"
        >
          <Italic size={14} />
        </button>

        <div className="w-px h-4 bg-slate-700/50 mx-1" />

         {/* Alignment */}
         <div className="flex bg-slate-900/50 rounded p-0.5">
            <button onClick={() => setTextAlign('left')} className={`p-1 rounded ${textAlign === 'left' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <AlignLeft size={14} />
            </button>
            <button onClick={() => setTextAlign('center')} className={`p-1 rounded ${textAlign === 'center' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <AlignCenter size={14} />
            </button>
            <button onClick={() => setTextAlign('right')} className={`p-1 rounded ${textAlign === 'right' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <AlignRight size={14} />
            </button>
         </div>
      </div>

      <textarea
        className={`w-full h-full bg-transparent text-slate-200 resize-none outline-none leading-relaxed p-2 ${fontFamily} transition-all duration-200 custom-scrollbar`}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textAlign: textAlign
        }}
        placeholder="Start typing your notes here..."
      />
    </div>
  );
};