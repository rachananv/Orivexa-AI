import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Copy, Bookmark, Trash2, StopCircle, Menu } from 'lucide-react';
import API_URL from '../config';
import { getGeminiResponse } from '../coreAI';

const ChatInterface = ({ toggleSidebar }) => {
  const userName = localStorage.getItem('orivexa_username') || 'bestie';
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: `Hi ${userName} 🌸 Ready to study smarter today? Upload some notes or ask me anything!` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const saveChat = () => {
    if (messages.length <= 1) return;
    
    const sessions = JSON.parse(localStorage.getItem('orivexa_saved_chats') || '[]');
    // Create a title from the first user message
    const firstUserMsg = messages.find(m => m.type === 'user');
    const title = firstUserMsg ? (firstUserMsg.text.length > 25 ? firstUserMsg.text.substring(0, 25) + '...' : firstUserMsg.text) : 'Study Session';
    
    const newSession = {
      id: Date.now(),
      title: title,
      date: new Date().toLocaleDateString() + ', ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      msgs: messages.length
    };
    
    localStorage.setItem('orivexa_saved_chats', JSON.stringify([newSession, ...sessions]));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices().find(v => v.name.includes('Female')) || null;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // Try to use Backend first, if fails or on GitHub Pages, use Gemini
    const isStaticEnv = window.location.hostname.includes('github.io');

    if (isStaticEnv) {
      try {
        const reply = await getGeminiResponse(currentInput);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: reply }]);
      } catch (e) {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: "I'm experiencing high traffic. Please try again! 🌸" }]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, session_id: 'default' })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: data.reply }]);
      } else {
        // Fallback to Gemini if backend returns error
        const reply = await getGeminiResponse(currentInput);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: reply }]);
      }
    } catch (e) {
      // Fallback to Gemini if backend is completely offline
      const reply = await getGeminiResponse(currentInput);
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: reply }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Uploaded: ${file.name}` }]);
    setIsTyping(true);

    // Check if we are on GitHub Pages (static environment)
    if (window.location.hostname.includes('github.io')) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, type: 'ai', text: `I've received "${file.name}"! Since this is a static preview on GitHub Pages, I've simulated the text extraction. You can now ask me questions about it! 📚✨` 
        }]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, type: 'ai', text: response.ok ? 'PDF processed successfully! Ask me anything about it. ✨' : `Failed: ${data.detail}` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: 'Network error while uploading. Using Demo Mode simulation instead.' }]);
    } finally {
      setIsTyping(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const suggestions = [
    "Explain machine learning simply",
    "Summarize this PDF",
    "Generate quiz questions",
    "Help me prepare for exams"
  ];

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-10">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center">
              Orivexa AI <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/20 uppercase tracking-widest font-bold">v2.0</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Advanced Study Assistant</p>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">Orivexa AI is online</span>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setMessages([{ id: 1, type: 'ai', text: 'Chat cleared! How can I help?' }])} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors tooltip" title="Clear Chat">
            <Trash2 size={18} />
          </button>
          <button 
            onClick={saveChat}
            className={`p-2 transition-colors tooltip ${isSaved ? 'text-green-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`} 
            title={isSaved ? "Saved!" : "Save Chat"}
          >
            <Bookmark size={18} className={isSaved ? 'fill-green-500' : ''} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] flex flex-col space-y-1 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.type === 'ai' && (
                  <div className="flex items-center space-x-2 px-2 text-xs text-slate-400">
                    <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <button className="hover:text-purple-400 transition-colors"><Copy size={12} /></button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-5 py-4 rounded-2xl rounded-bl-none flex items-center space-x-2 shadow-sm">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 z-10 bg-transparent">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {suggestions.map((suggestion, idx) => (
              <button 
                key={idx}
                onClick={() => setInput(suggestion)}
                className="px-4 py-2 rounded-full text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 backdrop-blur-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden px-2 py-2">
            <input 
              type="file" 
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-400 hover:text-purple-500 transition-colors tooltip"
              title="Upload PDF"
            >
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything or upload notes..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            <button 
              onClick={toggleListening}
              className={`p-3 mr-1 transition-all rounded-xl ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-pink-500'}`}
            >
              {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
                input.trim() 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <Send size={18} className={input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">
          Offline Mode is automatically activated if no API Key is provided.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
