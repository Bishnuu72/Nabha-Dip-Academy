import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Calendar, Award, FileText, CreditCard, Plus } from 'lucide-react';

const ParentPortal = () => {
  const { currentUser, students } = useContext(AppContext);
  const location = useLocation();
  const parentChildren = currentUser?.children || [];
  const defaultChildRoll = parentChildren.length > 0 ? parentChildren[0].rollNumber : currentUser?.childRoll;
  const [selectedChildRoll, setSelectedChildRoll] = useState(defaultChildRoll);
  const childInfo = students.find(s => s.rollNumber === selectedChildRoll);

  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'attendance', label: "Child's Attendance", icon: Calendar },
    { id: 'grades', label: 'Academic Progress', icon: Award },
    { id: 'invoices', label: 'Invoices & Fees', icon: CreditCard },
    { id: 'leave', label: 'Leave Applications', icon: Plus },
  ];

  const currentTab = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 font-sans">
      <aside className="lg:col-span-1 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-805 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-4">
            <div className="w-11 h-11 rounded-full bg-accent-light text-accent border border-accent/25 flex items-center justify-center font-bold text-lg select-none">
              {currentUser?.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[150px]">{currentUser?.name}</h4>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Parent Profile</span>
            </div>
          </div>
          <div className="p-3 bg-accent-light rounded-lg border border-accent/20 mb-5">
            <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Wards under monitor</span>
            {parentChildren.length > 1 ? (
              <select
                value={selectedChildRoll}
                onChange={(e) => setSelectedChildRoll(e.target.value)}
                className="w-full mt-1.5 p-1.5 rounded-lg border border-accent/20 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
              >
                {parentChildren.map(child => {
                  const fresh = students.find(s => s.rollNumber === child.rollNumber);
                  return (
                    <option key={child.rollNumber} value={child.rollNumber}>
                      {fresh?.name || child.name} (Roll: {child.rollNumber})
                    </option>
                  );
                })}
              </select>
            ) : childInfo ? (
              <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{childInfo.name}</h5>
            ) : null}
            {childInfo ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 block">Roll: {selectedChildRoll} | {childInfo.grade}</span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 block">No child record found</span>
            )}
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
          Assigned Mentor: <strong className="text-slate-700 dark:text-slate-350">Dr. Anand Verma</strong><br />
          Contact: <strong className="text-slate-700 dark:text-slate-350">teacher@school.edu</strong>
        </div>
      </aside>
      <main className="lg:col-span-3 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap border-b border-slate-200/50 dark:border-slate-850 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Parent Monitor Dashboard</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white capitalize mt-0.5">
              {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Controls
            </h1>
          </div>
          {childInfo && <span className="text-xs font-bold bg-accent-light text-accent py-1 px-3.5 rounded-full border border-accent/15">Ward: {childInfo.name}</span>}
        </div>
        <Outlet context={{ selectedChildRoll, childInfo, parentChildren }} />
      </main>
    </div>
  );
};

export default ParentPortal;
