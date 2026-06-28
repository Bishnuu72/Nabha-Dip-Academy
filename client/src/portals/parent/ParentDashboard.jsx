import React, { useContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Calendar, Award, FileText, CreditCard, CheckCircle } from 'lucide-react';

const ParentDashboard = () => {
  const { currentUser, students, attendance, results, leaveApplications } = useContext(AppContext);

  const { selectedChildRoll, childInfo } = useOutletContext();
  const childRoll = selectedChildRoll;

  const childAttendance = attendance[childRoll] || [];
  const presentDays = childAttendance.filter(r => r.status === 'Present').length;
  const totalDays = childAttendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  const childResult = results.find(r => r.rollNumber === childRoll) || null;

  const childLeaves = leaveApplications.filter(l => l.studentId === childInfo?.id);

  const [invoiceStatus, setInvoiceStatus] = useState('Unpaid');

  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out_forwards]">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { val: `${attendanceRate}%`, lbl: "Child's Attendance", icon: Calendar },
          { val: '88.2%', lbl: 'Average Score', icon: Award },
          { val: invoiceStatus === 'Paid' ? 0 : 1, lbl: 'Pending Bills', icon: CreditCard, danger: invoiceStatus !== 'Paid' },
          { val: childLeaves.length, lbl: 'Leave Logs', icon: FileText }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 flex items-center justify-between shadow-xs hover:-translate-y-0.5 transition-all">
              <div>
                <div className={`text-2xl font-extrabold leading-none ${kpi.danger ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{kpi.val}</div>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 shadow-sm">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white mb-4">Principal Mentor Remarks</h3>
          <div className="flex gap-4">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80"
              alt="Mentor"
              className="w-16 h-16 rounded-full object-cover shrink-0"
            />
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">Dr. Anand Verma (Science Head)</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1.5 leading-relaxed">
                "{childInfo?.name || 'Student'} is performing exceptionally well in Mathematics, scoring 95/100. However, he missed a practical session on Science electrostatics experiment. Please advise him to coordinate and write up lab files with classmates."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Recent Leave Requests</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {childLeaves.length > 0 ? (
              childLeaves.slice(0, 2).map(leave => (
                <div key={leave.id} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">Start: {leave.startDate}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Reason: {leave.reason}</p>
                  </div>
                  <span className={`
                    text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                    ${leave.status === 'approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55'
                      : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-55'}
                  `}>
                    {leave.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
                No leave applications submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
