import React, { useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Shield, Users, User, ClipboardList, Bell, Calendar, FileText, Image, CheckCircle, Megaphone, MessageCircle, Settings, GraduationCap, CreditCard } from 'lucide-react';

const AdminPortal = () => {
  const { currentUser } = useContext(AppContext);
  const location = useLocation();

  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Shield },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'teachers', label: 'Manage Teachers', icon: User },
    { id: 'parents', label: 'Manage Parents', icon: User },
    { id: 'subjects', label: 'Manage Subjects', icon: ClipboardList },
    { id: 'notices', label: 'Manage Notices', icon: Bell },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'admissions', label: 'Admissions Queue', icon: FileText },
    { id: 'deleted-students', label: 'Deleted Students', icon: FileText },
    { id: 'invoices', label: 'Manage Invoices', icon: CreditCard },
    { id: 'batch-students', label: 'Batch Students', icon: GraduationCap },
    { id: 'gallery', label: 'Manage Gallery', icon: Image },
    { id: 'leaves', label: 'Leave Approvals', icon: CheckCircle },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'testimonials', label: 'Testimonials', icon: MessageCircle },
    { id: 'settings', label: 'School Settings', icon: Settings },
  ];

  const currentTab = location.pathname.split('/').pop() || 'dashboard';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 lg:h-[calc(100vh-80px)] lg:overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      <aside className="lg:col-span-1 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-805 p-6 flex flex-col justify-between lg:overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
            {currentUser?.profileImage ? (
              <img src={currentUser.profileImage} alt={currentUser.name} className="w-11 h-11 rounded-full object-cover border-2 border-accent shadow-sm" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-bold text-lg text-white select-none">
                {(currentUser?.name || 'AD').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{currentUser?.name || 'System Root Admin'}</h4>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Principal & Administrator</span>
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
          Session: <strong className="text-slate-700 dark:text-slate-350">Superuser</strong><br />
          Node Host: <strong className="text-slate-700 dark:text-slate-350">Firebase Live</strong>
        </div>
      </aside>
      <main className="lg:col-span-3 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 gap-4 flex-wrap border-b border-slate-200/50 dark:border-slate-850 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Administrative System</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white capitalize mt-0.5">
              {currentTab.charAt(0).toUpperCase() + currentTab.slice(1).replace(/([A-Z])/g, ' $1')} Panels
            </h1>
          </div>
          <span className="text-xs font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 py-1 px-3.5 rounded-full border border-rose-55">ADMIN MODE</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPortal;
