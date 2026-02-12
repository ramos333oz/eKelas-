import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, CheckCircle2, Circle, ArrowRight, User, BookOpen, Globe } from 'lucide-react';
import { Sphere } from '../components/Sphere';
import { UserPreferences, ChatMessage } from '../types';
import { MOCK_CONVERSATION_FLOW } from '../constants';

interface ReceptionPageProps {
  onComplete: (prefs: UserPreferences) => void;
  onBack: () => void;
}

export const ReceptionPage: React.FC<ReceptionPageProps> = ({ onComplete, onBack }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    age: '',
    academicLevel: '',
    subject: '',
    topic: '',
    language: ''
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (step === 0 && messages.length === 0) {
      triggerAiMessage(MOCK_CONVERSATION_FLOW[0].text);
    }
  }, []);

  const triggerAiMessage = (text: string) => {
    setIsAiSpeaking(true);
    // Simulate thinking/speaking delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: text,
        timestamp: Date.now()
      }]);
      setIsAiSpeaking(false);
      // Automatically start listening after AI speaks
      setTimeout(() => setIsListening(true), 500);
    }, 1500);
  };

  const handleUserResponse = (text: string) => {
    setIsListening(false);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: Date.now()
    }]);

    // Update preference based on current step
    const currentField = MOCK_CONVERSATION_FLOW[step].field as keyof UserPreferences;
    setPreferences(prev => ({ ...prev, [currentField]: text }));

    // Move to next step
    if (step < MOCK_CONVERSATION_FLOW.length - 1) {
      setStep(prev => prev + 1);
      triggerAiMessage(MOCK_CONVERSATION_FLOW[step + 1].text);
    }
  };

  // Mock Voice Input Trigger
  const simulateVoiceInput = () => {
    if (!isListening) return;
    
    // Mock responses based on step
    const mockResponses = [
      "I'm Alex.",
      "I am 16 years old.",
      "High School Sophomore.",
      "Science.",
      "Quantum Physics.",
      "English."
    ];

    setTimeout(() => {
      handleUserResponse(mockResponses[step]);
    }, 1000);
  };

  const isComplete = step === MOCK_CONVERSATION_FLOW.length - 1 && preferences.language !== '';

  return (
    <div className="relative w-full h-full flex flex-col md:grid md:grid-cols-12 bg-slate-950 p-6 gap-6">
      
      {/* Background Ambient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.2),transparent_40%)] pointer-events-none" />

      {/* LEFT COL: Chat Transcript */}
      <div className="md:col-span-3 flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 p-4 backdrop-blur-sm shadow-xl">
        <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4 px-2">Transcript</h3>
        <div className="flex-1 overflow-y-auto space-y-4 px-2 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'ai' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {msg.sender === 'user' ? 'You' : 'Receptionist'}
              </span>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* CENTER COL: Avatar & Interaction */}
      <div className="md:col-span-6 flex flex-col items-center justify-center relative">
        <div className="absolute top-0 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-1">Reception</h2>
          <p className="text-slate-400 text-sm">Please provide your details to begin</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
           <Sphere 
            subject="General" 
            isSpeaking={isAiSpeaking} 
            isListening={isListening} 
            scale={1.5}
          />
          
          <div className="mt-12 h-16 w-full flex justify-center items-center">
            {isListening && (
              <motion.button
                onClick={simulateVoiceInput}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-full animate-pulse hover:bg-red-500/20 transition-colors"
              >
                <Mic size={20} />
                <span>Listening... (Tap to Speak)</span>
              </motion.button>
            )}
             {isAiSpeaking && (
              <div className="text-blue-400 font-medium tracking-wide flex items-center gap-2">
                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
                 <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                 Processing Input
              </div>
            )}
          </div>
        </div>

        {isComplete && (
           <motion.button
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             onClick={() => onComplete(preferences)}
             className="mb-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg flex items-center gap-2"
           >
             <span>Confirm Profile</span>
             <ArrowRight size={20} />
           </motion.button>
        )}
      </div>

      {/* RIGHT COL: Checklist */}
      <div className="md:col-span-3 flex flex-col justify-center">
         <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 shadow-2xl backdrop-blur-md">
            <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-400" />
              Student Profile
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Name', value: preferences.name, icon: User },
                { label: 'Age', value: preferences.age, icon: Circle }, // Using circle as generic bullet
                { label: 'Level', value: preferences.academicLevel, icon: BookOpen },
                { label: 'Subject', value: preferences.subject, icon: BookOpen },
                { label: 'Topic', value: preferences.topic, icon: BookOpen },
                { label: 'Language', value: preferences.language, icon: Globe },
              ].map((item, idx) => {
                const isFilled = item.value !== '';
                const isCurrent = idx === step;

                return (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                      isFilled 
                        ? 'bg-blue-900/20 border-blue-500/30' 
                        : isCurrent 
                          ? 'bg-slate-800 border-blue-500 border-l-4' 
                          : 'bg-transparent border-transparent opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isFilled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                        {isFilled ? <CheckCircle2 size={16} /> : <item.icon size={16} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</span>
                        <span className={`font-medium ${isFilled ? 'text-white' : 'text-slate-600'}`}>
                          {item.value || '...'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
         </div>
      </div>
    </div>
  );
};
