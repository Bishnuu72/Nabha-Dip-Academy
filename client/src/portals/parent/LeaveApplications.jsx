import React, { useContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Send, CheckCircle } from 'lucide-react';

const LeaveApplications = () => {
  const { currentUser, students, leaveApplications, submitLeaveRequest } = useContext(AppContext);

  const { selectedChildRoll, childInfo } = useOutletContext();
  const childRoll = selectedChildRoll;
  const childLeaves = leaveApplications.filter(l => l.studentId === childInfo?.id);

  const [leaveReason, setLeaveReason] = useState('');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!childInfo) return;
    submitLeaveRequest({
      studentId: childInfo.id,
      studentName: childInfo.name,
      parentName: currentUser.name,
      parentEmail: currentUser.email,
      reason: leaveReason,
      startDate: leaveStart,
      endDate: leaveEnd
    });
    triggerToast('Leave application sent to Principal office!');
    setLeaveReason('');
    setLeaveStart('');
    setLeaveEnd('');
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-6 border border-slate-200 dark:border-slate-805 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Submit Student Leave Request</h3>
          <form onSubmit={handleLeaveSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Reason for Leave</label>
              <input
                type="text"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g. Health illness / family event"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                  value={leaveStart}
                  onChange={(e) => setLeaveStart(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">End Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                  value={leaveEnd}
                  onChange={(e) => setLeaveEnd(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors mt-2 outline-none">
              <Send size={14} /> Submit Application
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Sent Leave History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60">
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Dates</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Reason</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                {childLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 text-slate-500 whitespace-nowrap">{leave.startDate} to {leave.endDate}</td>
                    <td className="p-3.5 px-5 font-semibold text-slate-800 dark:text-slate-300">{leave.reason}</td>
                    <td className="p-3.5 px-5">
                      <span className={`
                        text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                        ${leave.status === 'approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55'
                          : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-55'}
                      `}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplications;
