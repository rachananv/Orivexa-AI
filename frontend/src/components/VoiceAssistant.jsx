import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, StopCircle, Volume2, Menu } from 'lucide-react';
import API_URL from '../config';

const VoiceAssistant = ({ toggleSidebar }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('Tap the microphone and ask me anything about your studies!');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      setTranscript('Listening...');
      recognition.start();
      setIsListening(true);
      
      recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        setAiResponse('Thinking...');
        
        // Check if we are on GitHub Pages (static environment)
        if (window.location.hostname.includes('github.io')) {
          setTimeout(() => {
            const replyText = "I'm processing your voice command. I'm ready to assist you with your academic questions. What would you like to discuss today? ✨";
            setAiResponse(replyText);
            speakText(replyText);
          }, 1000);
          return;
        }

        try {
          const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, session_id: 'voice' })
          });
          const data = await response.json();
          const replyText = response.ok ? data.reply : 'Error generating response';
          setAiResponse(replyText);
          speakText(replyText);
        } catch (e) {
          setAiResponse('Backend is offline, but I can still chat in Demo Mode! 🌸');
          speakText('Backend is offline, but I can still chat in Demo Mode!');
        }
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Voice not recognized. Please try again.');
      };
      recognition.onend = () => setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.name.includes('Female')) || null;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Mobile Header */}
      <header className="h-16 md:hidden border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-md flex items-center px-4 z-10 sticky top-0">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="ml-3 font-bold text-lg">Voice Assistant</span>
      </header>

      <div className="flex-1 p-8 flex items-center justify-center relative">
      {/* Dynamic Background */}
      {(isListening || isSpeaking) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[100px] animate-pulse"></div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl text-center z-10"
      >
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-slate-500 dark:text-slate-400 min-h-[60px]">
            {transcript || "..."}
          </h2>
        </div>

        <div className="flex justify-center mb-12 relative">
          {isSpeaking && (
             <span className="absolute inset-0 flex items-center justify-center -z-10">
               <span className="animate-ping absolute h-48 w-48 rounded-full bg-blue-400 opacity-20"></span>
               <span className="animate-ping absolute h-64 w-64 rounded-full bg-purple-400 opacity-20 animation-delay-500"></span>
             </span>
          )}
          
          <button 
            onClick={toggleListening}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl relative ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 shadow-purple-500/50'
            }`}
          >
            {isListening ? <StopCircle size={48} /> : <Mic size={48} />}
          </button>
        </div>

        <div className="bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md p-8 rounded-3xl shadow-xl min-h-[150px] flex items-center justify-center relative">
          {isSpeaking && <Volume2 className="absolute top-4 right-4 text-purple-400 animate-pulse" size={24} />}
          <p className="text-xl font-medium text-slate-800 dark:text-slate-200">
            {aiResponse}
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
