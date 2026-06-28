import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Settings, User, Users, Shield, GraduationCap, Eye } from 'lucide-react';

const DevToolbar = () => {
  const { activeRole, switchSimulatedRole, setActivePage, currentUser } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const roles = [
    { id: 'guest', label: 'Guest User', desc: 'Public school website', icon: Eye, badge: 'Visitor' },
    { id: 'student', label: 'Rahul Sharma', desc: 'Class 10 (Secondary)', icon: GraduationCap, badge: 'Student' },
    { id: 'parent', label: 'Sunita Sharma', desc: 'Rahul’s Mother', icon: Users, badge: 'Parent' },
    { id: 'teacher', label: 'Dr. Anand Verma', desc: 'Science HOD', icon: User, badge: 'Teacher' },
    { id: 'admin', label: 'System Root', desc: 'Full administration', icon: Shield, badge: 'Admin' }
  ];

  const handleRoleChange = async (roleId) => {
    if (switchSimulatedRole) {
      await switchSimulatedRole(roleId);
    }
    setIsOpen(false);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" ref={panelRef}>
      <button 
        className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl border-2 border-white dark:border-slate-800 cursor-pointer transition-all duration-300 hover:bg-accent-hover hover:rotate-30 hover:scale-105 active:scale-95 outline-none" 
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Roles (Demo Control)"
      >
        <Settings size={25} />
      </button>

      {isOpen && (
        <div className="absolute bottom-18 right-0 w-80 rounded-xl p-4 shadow-2xl glass border border-slate-200 dark:border-slate-850 flex flex-col gap-3">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Settings size={17} className="text-accent animate-spin" style={{ animationDuration: '6s' }} />
            <span>Role Switcher</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-850 leading-relaxed">
            Quickly toggle user states to test page views & permissions.
          </p>

          <div className="flex flex-col gap-1.5">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  className={`
                    flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all w-full outline-none
                    ${isActive 
                      ? 'border-accent bg-accent-light dark:bg-amber-950/20 text-slate-900 dark:text-amber-100 font-semibold' 
                      : 'border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-accent dark:hover:border-accent hover:bg-slate-50 dark:hover:bg-slate-800'}
                  `}
                  onClick={() => handleRoleChange(role.id)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`
                      flex items-center justify-center w-7 h-7 rounded-full transition-all
                      ${isActive ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-accent'}
                    `}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <span className="text-xs leading-none block">{role.label}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5 leading-none">{role.desc}</span>
                    </div>
                  </div>
                  <span className={`
                    text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider
                    ${isActive ? 'bg-accent text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                  `}>
                    {role.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-850 mt-1">
            <span>Route: <strong className="text-slate-600 dark:text-slate-300">{currentUser ? 'Dashboard' : 'Public Site'}</strong></span>
            <span>User: <strong className="text-slate-600 dark:text-slate-300">{currentUser ? currentUser.name.split(' ')[0] : 'Guest'}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevToolbar;
