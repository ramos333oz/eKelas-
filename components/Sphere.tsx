import React from 'react';
import { motion } from 'framer-motion';
import { SUBJECT_COLORS } from '../constants';

interface SphereProps {
  subject?: string;
  isSpeaking?: boolean;
  isListening?: boolean;
  scale?: number;
}

export const Sphere: React.FC<SphereProps> = ({ 
  subject = 'General', 
  isSpeaking = false,
  isListening = false,
  scale = 1 
}) => {
  const gradientClass = SUBJECT_COLORS[subject] || SUBJECT_COLORS['General'];

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow / Waveform Simulation */}
      {(isSpeaking || isListening) && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2], 
              scale: [1, 1.5, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: isSpeaking ? 2 : 1.5,
              ease: "easeInOut" 
            }}
            className={`absolute rounded-full w-64 h-64 bg-gradient-to-r ${gradientClass} blur-3xl opacity-20`}
          />
           <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1], 
              scale: [1.2, 1.8, 1.2],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: isSpeaking ? 2.5 : 2,
              ease: "easeInOut",
              delay: 0.2
            }}
            className={`absolute rounded-full w-64 h-64 bg-gradient-to-r ${gradientClass} blur-3xl opacity-10`}
          />
        </>
      )}

      {/* Core Sphere */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : 1,
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
        className={`relative z-10 w-48 h-48 rounded-full bg-gradient-to-br ${gradientClass} shadow-[0_0_60px_rgba(59,130,246,0.3)] flex items-center justify-center overflow-hidden`}
        style={{ transform: `scale(${scale})` }}
      >
         {/* Inner texture/shine */}
         <div className="absolute inset-0 bg-white opacity-10 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent)]" />
         
         {/* Listening State Pulse */}
         {isListening && (
           <motion.div 
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-white mix-blend-overlay"
           />
         )}
      </motion.div>
    </div>
  );
};
