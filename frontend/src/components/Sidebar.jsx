import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, FileUp, Bookmark, Mic, Settings, Moon, Sun, Info, Sparkles, BrainCircuit, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isDarkMode, toggleDarkMode, isOpen, setIsOpen }) => {
  const navItems = [
    { icon: <MessageSquare size={20} />, label: 'New Chat', path: '/app/chat' },
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app/dashboard' },
    { icon: <FileUp size={20} />, label: 'Upload Notes', path: '/app/upload' },
    { icon: <BrainCircuit size={20} />, label: 'Quiz Generator', path: '/app/quiz' },
    { icon: <Bookmark size={20} />, label: 'Saved Chats', path: '/app/saved' },
    { icon: <Mic size={20} />, label: 'Voice Assistant', path: '/app/voice' },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ 
        x: window.innerWidth >= 768 ? 0 : (isOpen ? 0 : -260),
        width: window.innerWidth >= 768 ? 260 : (isOpen ? 260 : 0)
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className={`fixed md:relative h-full flex flex-col border-r backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'} z-30`}
    >
      <div className="mb-10 flex items-center justify-between px-6 mt-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Orivexa AI
          </h1>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-200"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onClick={() => window.innerWidth < 768 && setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 font-medium' 
                : 'hover:bg-slate-800/30 text-slate-400 hover:text-slate-200'}
            `}
          >
            {item.icon}
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <button 
          onClick={toggleDarkMode}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/30 text-slate-400 hover:text-slate-200 transition-all duration-300"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <NavLink to="/app/settings" className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800/30 text-slate-400 hover:text-slate-200 transition-all duration-300">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center space-x-3 cursor-pointer hover:bg-purple-500/20 transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-purple-500">
            {/* Mascot Placeholder */}
            <span className="text-xl">🌸</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">Hi {localStorage.getItem('orivexa_username') || 'bestie'}!</p>
            <p className="text-xs text-purple-400">Ready to study?</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
