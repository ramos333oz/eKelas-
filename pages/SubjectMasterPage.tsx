import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, LogOut, PenTool, StickyNote, BarChart3, MessageSquare, GripVertical, AlertTriangle } from 'lucide-react';
import { Sphere } from '../components/Sphere';
import { FloatingWindow } from '../components/FloatingWindow';
import { Whiteboard } from '../components/Whiteboard';
import { NotesContent } from '../components/NotesContent';
import { WindowState, UserPreferences, ChatMessage } from '../types';

interface SubjectMasterPageProps {
  preferences: UserPreferences;
  onExit: () => void;
}

export const SubjectMasterPage: React.FC<SubjectMasterPageProps> = ({ preferences, onExit }) => {
  const [sessionName, setSessionName] = useState(`${preferences.subject} Session`);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'notes', title: 'Notes', isOpen: false, isMinimized: false, position: { x: 50, y: 100 }, size: { width: 400, height: 500 }, zIndex: 10, type: 'notes' },
    { id: 'whiteboard', title: 'Whiteboard', isOpen: false, isMinimized: false, position: { x: 500, y: 100 }, size: { width: 600, height: 500 }, zIndex: 11, type: 'whiteboard' },
    { id: 'visuals', title: 'Visual Aids', isOpen: false, isMinimized: false, position: { x: 300, y: 300 }, size: { width: 500, height: 400 }, zIndex: 12, type: 'visuals' },
  ]);

  const [isMicActive, setIsMicActive] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: `Welcome to ${preferences.subject} Master Class. I see you want to learn about ${preferences.topic}. Let's dive in.`, timestamp: Date.now() }
  ]);

  const toggleWindow = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (w.isOpen && w.isMinimized) return { ...w, isMinimized: false, zIndex: getNextZIndex() };
        if (w.isOpen) return { ...w, isMinimized: true }; // Optional: Logic to close if needed, but toggle usually opens
        return { ...w, isOpen: true, zIndex: getNextZIndex() };
      }
      return w;
    }));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: getNextZIndex() } : w));
  };

  const handleResize = (id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, size: { width, height } } : w));
  };

  const getNextZIndex = () => Math.max(...windows.map(w => w.zIndex)) + 1;

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <header className="z-50 flex items-center justify-between px-8 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div className="flex flex-col">
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="bg-transparent border-b-2 border-transparent hover:border-slate-700 focus:border-blue-500 outline-none text-xl font-display font-bold text-white tracking-wider w-auto min-w-[200px] transition-colors pb-1"
            />
          </div>
          <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">
            {preferences.topic}
          </span>
        </div>
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Exit Session
        </button>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* Central Avatar */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <Sphere 
            subject={preferences.subject}
            isSpeaking={!isMicActive} // Simulate AI speaking when user isn't
            isListening={isMicActive}
            scale={2}
          />
        </div>

        {/* Floating Windows Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Allow pointer events only on the windows themselves */}
          <div className="w-full h-full pointer-events-auto">
             <AnimatePresence>
              {windows.filter(w => w.isOpen).map(window => (
                <FloatingWindow
                  key={window.id}
                  windowState={window}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onFocus={focusWindow}
                  onResize={handleResize}
                >
                  {window.type === 'notes' && <NotesContent />}
                  {window.type === 'whiteboard' && <Whiteboard />}
                  {window.type === 'visuals' && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4 p-4 border-2 border-dashed border-slate-700 rounded-lg">
                      <BarChart3 size={48} className="text-slate-600" />
                      <p className="text-center text-sm">Visual aids related to {preferences.topic} will appear here dynamically.</p>
                    </div>
                  )}
                </FloatingWindow>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </main>

      {/* Draggable Dock Toolbar (Previously in Footer) */}
      <motion.div 
        drag
        dragMomentum={false}
        initial={{ x: 0, y: 0 }}
        className="fixed top-24 right-8 z-[60] flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing"
      >
         <div className="px-1 text-slate-600 cursor-grab">
           <GripVertical size={20} />
         </div>
         <button 
          onClick={() => toggleWindow('notes')}
          className={`p-4 rounded-xl transition-all ${windows.find(w => w.id === 'notes')?.isOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <StickyNote size={24} />
        </button>
         <button 
          onClick={() => toggleWindow('whiteboard')}
          className={`p-4 rounded-xl transition-all ${windows.find(w => w.id === 'whiteboard')?.isOpen ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <PenTool size={24} />
        </button>
         <button 
          onClick={() => toggleWindow('visuals')}
          className={`p-4 rounded-xl transition-all ${windows.find(w => w.id === 'visuals')?.isOpen ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <BarChart3 size={24} />
        </button>
         <div className="w-px h-10 bg-slate-700 mx-2" />
         <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-4 rounded-xl transition-all ${chatOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <MessageSquare size={24} />
        </button>
      </motion.div>

      {/* Mic Control (Sticky Center Bottom) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setIsMicActive(!isMicActive)}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 transition-all duration-300 ${
            isMicActive 
              ? 'bg-red-500 border-red-400 shadow-[0_0_50px_rgba(239,68,68,0.5)] scale-110' 
              : 'bg-slate-800 border-slate-600 hover:border-slate-500'
          }`}
        >
          {isMicActive ? <Mic size={32} className="text-white" /> : <MicOff size={32} className="text-slate-400" />}
        </button>
      </div>

      {/* Chat Sidebar Overlay */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-16 bottom-0 w-80 bg-slate-900/95 backdrop-blur border-l border-slate-700 shadow-2xl z-40 flex flex-col"
          >
             <div className="p-4 border-b border-slate-700">
               <h3 className="font-semibold text-white">Session Transcript</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {chatMessages.map(msg => (
                 <div key={msg.id} className={`p-3 rounded-lg text-sm ${msg.sender === 'ai' ? 'bg-slate-800 text-slate-200' : 'bg-blue-900/50 text-blue-100 ml-auto max-w-[80%]'}`}>
                   {msg.text}
                 </div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setShowExitConfirm(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                      <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">End Session?</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                      Are you sure you want to end <span className="text-white font-medium">"{sessionName}"</span>? Any unsaved notes might be lost.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={() => setShowExitConfirm(false)}
                            className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-colors w-full"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onExit}
                            className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-500 font-medium transition-colors w-full shadow-lg shadow-red-500/20"
                        >
                            End Session
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};