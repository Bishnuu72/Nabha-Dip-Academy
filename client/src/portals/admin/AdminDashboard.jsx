import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Users, User, Bell, Calendar, ClipboardList, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { students, teachers, notices, events, parents, subjects, applications } = useContext(AppContext);

  const kpis = [
    { val: students.length, lbl: 'Total Students', icon: Users },
    { val: teachers.length, lbl: 'Total Instructors', icon: User },
    { val: notices.length, lbl: 'Total Notices', icon: Bell },
    { val: events.length, lbl: 'Upcoming Events', icon: Calendar },
    { val: parents.length, lbl: 'Registered Parents', icon: User },
    { val: subjects.length, lbl: 'Total Subjects', icon: ClipboardList },
    { val: applications.filter(a => a.status === 'pending').length, lbl: 'Pending Applications', icon: FileText }
  ];
  const pendingApps = applications.filter(a => a.status === 'pending');
  const pendingLeaves = [];

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 flex items-center justify-between shadow-xs hover:-translate-y-0.5 transition-all">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{kpi.val}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-2">{kpi.lbl}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Recent Pending Admissions</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {pendingApps.length > 0 ? pendingApps.map(app => (
              <div key={app.id} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">{app.studentName}</h4>
                  <span className="text-[10px] text-slate-455 dark:text-slate-500 font-medium block">Grade: {app.grade} | {app.stream}</span>
                </div>
                <button className="py-1 px-3 rounded font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer" onClick={() => navigate('admissions')}>Review File</button>
              </div>
            )) : (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-medium">No pending admission forms queue.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
