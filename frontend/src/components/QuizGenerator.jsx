import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle, XCircle, Menu } from 'lucide-react';
import API_URL from '../config';

const QuizGenerator = ({ toggleSidebar }) => {
  const [quiz, setQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async () => {
    setIsLoading(true);
    setError('');
    setShowResults(false);
    setAnswers({});
    setQuiz([]);

    try {
      const response = await fetch(`${API_URL}/api/quiz`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.detail || 'Failed to generate quiz.');
        setIsLoading(false);
        return;
      }

      // data.quiz is a stringified JSON array
      const parsedQuiz = JSON.parse(data.quiz.replace(/```json/g, '').replace(/```/g, ''));
      setQuiz(parsedQuiz);
    } catch (err) {
      setError('Network error or failed to parse quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (qIdx, option) => {
    if (showResults) return;
    setAnswers({ ...answers, [qIdx]: option });
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });
    return score;
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
        <span className="ml-3 font-bold text-lg">Quiz Generator</span>
      </header>

      <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Quiz Generator 🧠</h1>
            <p className="text-slate-400">Test your knowledge based on your uploaded notes.</p>
          </div>
          <button 
            onClick={generateQuiz}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center space-x-2"
          >
            <BrainCircuit size={20} />
            <span>{isLoading ? 'Generating...' : 'Generate New Quiz'}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 mb-6">
            {error}
          </div>
        )}

        {quiz.length > 0 && (
          <div className="space-y-6">
            {quiz.map((q, qIdx) => (
              <div key={qIdx} className="p-6 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl">
                <h3 className="text-xl font-medium mb-4">{qIdx + 1}. {q.question}</h3>
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[qIdx] === opt;
                    const isCorrect = showResults && opt === q.answer;
                    const isWrong = showResults && isSelected && opt !== q.answer;
                    
                    let bgClass = "bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-purple-500 cursor-pointer";
                    if (isSelected) bgClass = "bg-purple-500/20 border-purple-500";
                    if (isCorrect) bgClass = "bg-green-500/20 border-green-500";
                    if (isWrong) bgClass = "bg-red-500/20 border-red-500";

                    return (
                      <div 
                        key={oIdx} 
                        onClick={() => handleSelect(qIdx, opt)}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between ${bgClass}`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle className="text-green-500" size={20} />}
                        {isWrong && <XCircle className="text-red-500" size={20} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {!showResults ? (
              <button 
                onClick={() => setShowResults(true)}
                disabled={Object.keys(answers).length !== quiz.length}
                className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg transition-colors disabled:opacity-50"
              >
                Submit Answers
              </button>
            ) : (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-center">
                <h2 className="text-3xl font-bold mb-2">You scored {calculateScore()} out of {quiz.length}!</h2>
                <p className="text-slate-400">Keep up the great work! 🌸</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizGenerator;
