import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, CheckCircle, Clock, Menu } from 'lucide-react';
import API_URL from '../config';

const Dashboard = ({ toggleSidebar }) => {
  const [dashboardData, setDashboardData] = useState({ documents_uploaded: 0, recent_activity: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      // Check if we are on GitHub Pages (static environment)
      if (window.location.hostname.includes('github.io')) {
        setDashboardData({
          documents_uploaded: 2,
          recent_activity: [
            { title: "Uploaded 'Physics_Notes.pdf'", time: "10:30 AM" },
            { title: "Asked: 'What is entropy?'", time: "11:15 AM" }
          ]
        });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/dashboard`);
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
           // Fallback for failed fetch
           setDashboardData({ documents_uploaded: 0, recent_activity: [] });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
        setDashboardData({ documents_uploaded: 1, recent_activity: [{title: "Demo Mode Active", time: "Now"}] });
      }
    };
    fetchDashboard();
  }, []);

  const studyMins = parseInt(localStorage.getItem('study_minutes') || '0');
  const studyHoursFormatted = studyMins >= 60 ? `${(studyMins / 60).toFixed(1)}h` : `${studyMins}m`;

  const stats = [
    { title: 'Documents Uploaded', value: dashboardData.documents_uploaded, icon: <FileText className="text-purple-400" size={24} /> },
    { title: 'Questions Asked', value: dashboardData.recent_activity.filter(a => a.title.startsWith("Asked:")).length, icon: <BookOpen className="text-blue-400" size={24} /> },
    { title: 'Study Time', value: studyHoursFormatted, icon: <Clock className="text-pink-400" size={24} /> },
    { title: 'Quizzes Passed', value: '0', icon: <CheckCircle className="text-green-400" size={24} /> },
  ];

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
        <span className="ml-3 font-bold text-lg">Dashboard</span>
      </header>

      <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome Back! 🌸</h1>
        <p className="text-slate-400 mb-8">Here is your study progress so far.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {dashboardData.recent_activity.length > 0 ? dashboardData.recent_activity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <span className="font-medium">{activity.title}</span>
                  <span className="text-sm text-slate-500">{activity.time}</span>
                </div>
              )) : (
                <div className="text-slate-400 italic">No recent activity found.</div>
              )}
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 backdrop-blur-md shadow-xl">
            <h3 className="text-xl font-bold mb-4">Daily Study Motivation</h3>
            <div className="h-full min-h-[200px] flex items-center justify-center p-8 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <p className="text-xl font-medium italic text-slate-300">
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
