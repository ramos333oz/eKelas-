import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomePage } from './pages/WelcomePage';
import { ReceptionPage } from './pages/ReceptionPage';
import { SubjectMasterPage } from './pages/SubjectMasterPage';
import { PageState, UserPreferences } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('welcome');
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  const handleStart = () => {
    setCurrentPage('reception');
  };

  const handleReceptionComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    setCurrentPage('master');
  };

  const handleBackToWelcome = () => {
    setCurrentPage('welcome');
    setUserPreferences(null);
  };

  const handleExitSession = () => {
    setCurrentPage('reception');
    // We keep preferences for reception revisit, or could clear them.
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-50">
      <AnimatePresence mode="wait">
        {currentPage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <WelcomePage onStart={handleStart} />
          </motion.div>
        )}

        {currentPage === 'reception' && (
          <motion.div
            key="reception"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <ReceptionPage 
              onComplete={handleReceptionComplete} 
              onBack={handleBackToWelcome}
            />
          </motion.div>
        )}

        {currentPage === 'master' && userPreferences && (
          <motion.div
            key="master"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <SubjectMasterPage 
              preferences={userPreferences} 
              onExit={handleExitSession} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
