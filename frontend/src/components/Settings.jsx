import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Save, CheckCircle, Menu } from 'lucide-react';

const Settings = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState('bestie');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('orivexa_username');
    if (savedName) setUserName(savedName);
  }, []);

  const handleSave = () => {
    localStorage.setItem('orivexa_username', userName);
    setStatus('Profile saved successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Mobile Header */}
      <header className="h-16 md:hidden border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-md flex items-center px-4 z-10 sticky top-0">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="ml-3 font-bold text-lg">Settings</span>
      </header>

      <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Profile Settings ⚙️</h1>

        <div className="p-8 rounded-3xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
              <User className="text-purple-400" />
              <span>Your Name</span>
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              What should Orivexa call you?
            </p>
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex"
                className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleSave}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Save</span>
              </button>
            </div>
          </div>
          {status && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center space-x-2">
              <CheckCircle size={18} />
              <span>{status}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
