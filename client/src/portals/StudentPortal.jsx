import React, { useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { BookOpen, Calendar, Award, FileText } from 'lucide-react';

const StudentPortal = () => {
  const { currentUser } = useContext(AppContext);
  const location = useLocation();
  const studentRoll = currentUser?.rollNumber || '1001';

  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'attendance', label: 'Attendance Log', icon: Calendar },
    { id: 'results', label: 'Exam Results', icon: Award },
    { id: 'routine', label: 'Class Routine', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: FileText }
  ];

  const currentTab = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 font-sans">
      <aside className="lg:col-span-1 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-805 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="w-11 h-11 rounded-full bg-accent-light text-accent border border-accent/25 flex items-center justify-center font-bold text-lg select-none">
              {currentUser?.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[150px]">{currentUser?.name}</h4>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Roll No: {studentRoll} | {currentUser?.grade}</span>
            </div>
          </div>
          <ul className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 list-none border-b border-slate-100 lg:border-none">
            {sidebarTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <li key={tab.id} className="w-full shrink-0 lg:shrink">
                  <NavLink
                    to={tab.id}
                    className={`flex items-center gap-3 p-3 rounded-lg font-bold text-xs md:text-sm transition-all w-full text-left cursor-pointer outline-none ${isActive ? 'bg-accent-light dark:bg-amber-950/20 text-accent' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-accent'}`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden lg:block p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl text-xs text-slate-450 border border-slate-200/50 dark:border-slate-850 leading-relaxed mt-6">
          System Session: <strong className="text-slate-700 dark:text-slate-300">Live</strong><br />
          Section: <strong className="text-slate-700 dark:text-slate-300">{currentUser?.stream}</strong>
        </div>
      </aside>
      <main className="lg:col-span-3 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap border-b border-slate-200/50 dark:border-slate-850 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Student Portal Workspace</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white capitalize mt-0.5">
              {currentTab} Overview
            </h1>
          </div>
          <span className="text-xs font-bold bg-accent-light text-accent py-1 px-3.5 rounded-full border border-accent/15">Class Level: {currentUser?.grade}</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentPortal;
