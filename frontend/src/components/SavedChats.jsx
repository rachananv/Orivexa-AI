import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Trash2, ArrowRight, Menu } from 'lucide-react';

const SavedChats = ({ toggleSidebar }) => {
  const [savedSessions, setSavedSessions] = useState([]);

  useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem('orivexa_saved_chats') || '[]');
    setSavedSessions(sessions);
  }, []);

  const handleDelete = (id) => {
    const updated = savedSessions.filter(s => s.id !== id);
    setSavedSessions(updated);
    localStorage.setItem('orivexa_saved_chats', JSON.stringify(updated));
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
        <span className="ml-3 font-bold text-lg">Saved Chats</span>
      </header>

      <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Saved Chats 🔖</h1>
            <p className="text-slate-400">Review your past study sessions and conversations.</p>
          </div>
        </div>

        {savedSessions.length === 0 ? (
          <div className="text-center p-12 bg-white/5 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-medium text-slate-500 mb-2">No saved chats yet!</h3>
            <p className="text-slate-400">When you save a chat in the Chat Interface, it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSessions.map((session) => (
              <div key={session.id} className="p-6 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl flex flex-col group hover:border-purple-500/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                    <MessageSquare size={24} />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(session.id); }}
                    className="p-2 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">{session.title}</h3>
                <div className="flex items-center justify-between mt-auto pt-4 text-sm text-slate-500">
                  <span>{session.date}</span>
                  <span className="flex items-center space-x-1">
                    <span>{session.msgs} messages</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default SavedChats;
