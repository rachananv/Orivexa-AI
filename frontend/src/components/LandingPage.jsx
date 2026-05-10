import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BrainCircuit, Mic, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Orivexa AI
          </span>
        </div>
        <button 
          onClick={() => navigate('/app')}
          className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all font-medium"
        >
          Login
        </button>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-8"
        >
          <Sparkles size={16} />
          <span className="text-sm font-medium">Your Smart AI Study Companion Powered by RAG</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">Smarter</span>,
          <br /> Not Harder.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl"
        >
          Upload your notes, ask questions, and get instant personalized explanations from your cute, futuristic AI tutor.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button 
            onClick={() => navigate('/app')}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all flex items-center space-x-2 hover:scale-105"
          >
            <span>Start Chatting</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto w-full"
        >
          {[
            { icon: <BrainCircuit className="text-purple-400" size={32} />, title: 'RAG Powered', desc: 'Accurate answers straight from your uploaded PDFs.' },
            { icon: <Mic className="text-pink-400" size={32} />, title: 'Voice Assistant', desc: 'Talk to your AI tutor hands-free.' },
            { icon: <GraduationCap className="text-blue-400" size={32} />, title: 'Study Tools', desc: 'Quizzes, flashcards, and summaries in a click.' }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-md hover:bg-slate-800/80 transition-colors text-left group">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
