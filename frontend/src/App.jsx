import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import UploadNotes from './components/UploadNotes';
import Settings from './components/Settings';
import QuizGenerator from './components/QuizGenerator';
import SavedChats from './components/SavedChats';
import VoiceAssistant from './components/VoiceAssistant';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Simple study hours tracker
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMins = parseInt(localStorage.getItem('study_minutes') || '0');
      localStorage.setItem('study_minutes', currentMins + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} font-sans overflow-hidden transition-colors duration-300`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/*" element={
            <div className="flex h-screen overflow-hidden">
              <Sidebar isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
              <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                <Routes>
                  <Route path="/" element={<Navigate to="/app/chat" replace />} />
                  <Route path="/chat" element={<ChatInterface />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadNotes />} />
                  <Route path="/quiz" element={<QuizGenerator />} />
                  <Route path="/saved" element={<SavedChats />} />
                  <Route path="/voice" element={<VoiceAssistant />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/app/chat" replace />} />
                </Routes>
              </div>
              
              {/* Background Glow Effects */}
              <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob pointer-events-none"></div>
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
              <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
