import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

interface WelcomePageProps {
  onStart: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Particles (Simulated with simple divs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/20 blur-xl"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -100],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
             <Sparkles className="text-cyan-400" size={32} />
             <span className="text-cyan-400 tracking-widest uppercase text-sm font-semibold">System Online</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white tracking-tight mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            AETHERIA
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-lg mx-auto leading-relaxed">
            Your personalized AI learning companion for the next generation of knowledge.
          </p>
        </motion.div>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-12 py-6 bg-blue-600 rounded-full text-white text-xl font-semibold tracking-wide shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.7)] flex items-center gap-4"
        >
          <span className="relative z-10">Initialize Session</span>
          <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
          
          {/* Button Pulse Effect */}
          <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20" />
        </motion.button>
      </div>

      <div className="absolute bottom-12 text-slate-600 text-sm tracking-wider uppercase">
        v2.5.0 // Neural Interface Active
      </div>
    </div>
  );
};
