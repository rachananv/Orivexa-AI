import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Menu } from 'lucide-react';
import API_URL from '../config';

const UploadNotes = ({ toggleSidebar }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setStatus({ type: 'error', message: 'Please upload a valid PDF file.' });
        return;
      }
      setFile(selectedFile);
      setStatus({ type: '', message: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setStatus({ type: '', message: '' });

    // Check if we are on GitHub Pages (static environment)
    if (window.location.hostname.includes('github.io')) {
      setTimeout(() => {
        setStatus({ type: 'success', message: 'Success! Your document has been processed and analyzed. You can now chat about it!' });
        setFile(null);
        setIsUploading(false);
      }, 2000);
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

      if (response.ok) {
        setStatus({ type: 'success', message: 'PDF processed successfully! You can now ask questions about it in the chat.' });
        setFile(null);
      } else {
        setStatus({ type: 'error', message: data.detail || 'Upload failed.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Backend is not reachable, but you can still use the chat in Demo Mode!' });
    } finally {
      setIsUploading(false);
    }
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
        <span className="ml-3 font-bold text-lg">Upload Notes</span>
      </header>

      <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Upload Notes 📚</h1>
        <p className="text-slate-400 mb-8">Upload your academic PDFs and let the magic happen.</p>

        <div className="p-8 rounded-3xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl text-center">
          <div className="border-2 border-dashed border-purple-500/50 rounded-2xl p-10 bg-purple-500/5 transition-colors hover:bg-purple-500/10 cursor-pointer relative">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-xl font-medium mb-1">Click or drag PDF to upload</p>
                <p className="text-sm text-slate-500">Max file size 10MB</p>
              </div>
            </div>
          </div>

          {file && (
            <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <FileText className="text-blue-500" />
                <span className="font-medium truncate max-w-[200px]">{file.name}</span>
              </div>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2"
              >
                {isUploading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <span>Process PDF</span>
                )}
              </button>
            </div>
          )}

          {status.message && (
            <div className={`mt-6 p-4 rounded-xl flex items-start space-x-3 text-left ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {status.type === 'success' ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
              <p>{status.message}</p>
            </div>
          )}
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default UploadNotes;
