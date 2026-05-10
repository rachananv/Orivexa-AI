import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({ documents_uploaded: 0, recent_activity: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
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
    <div className="flex-1 p-8 overflow-y-auto">
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
  );
};

export default Dashboard;
