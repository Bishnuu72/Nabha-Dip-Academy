import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckCircle, XCircle, Undo2, Trash } from 'lucide-react';
import { statusBadge, confirmAction } from './shared';

const LeaveApprovals = () => {
  const { leaveApplications, updateLeaveStatus, deleteLeaveApplication } = useContext(AppContext);
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {toast && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} /><span>{toast}</span>
        </div>
      )}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Parent Leave Requests Register</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                {['Student Name', 'Parent Name', 'Reason', 'Duration', 'Status', 'Actions'].map(h => (<th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {leaveApplications.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                  <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{leave.studentName}</td>
                  <td className="p-3.5 px-5 text-slate-500">{leave.parentName}</td>
                  <td className="p-3.5 px-5 text-slate-500 max-w-xs">{leave.reason}</td>
                  <td className="p-3.5 px-5 text-slate-500 whitespace-nowrap">{leave.startDate} to {leave.endDate}</td>
                  <td className="p-3.5 px-5"><span className={statusBadge(leave.status)}>{leave.status}</span></td>
                  <td className="p-3.5 px-5">
                    <div className="flex items-center gap-1">
                      {leave.status === 'pending' ? (
                        <>
                          <button data-tip="Approve" className="p-2 rounded-lg text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all duration-150 cursor-pointer" onClick={() => { updateLeaveStatus(leave.id, 'approved'); triggerToast('Leave Approved.'); }}><CheckCircle size={15} /></button>
                          <button data-tip="Reject" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={() => { updateLeaveStatus(leave.id, 'rejected'); triggerToast('Leave Rejected.'); }}><XCircle size={15} /></button>
                        </>
                      ) : (
                        <button data-tip="Reset" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-400 transition-all duration-150 cursor-pointer" onClick={() => { updateLeaveStatus(leave.id, 'pending'); triggerToast('Leave Reset to Pending.'); }}><Undo2 size={15} /></button>
                      )}
                      <button data-tip="Delete" className="p-2 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 transition-all duration-150 cursor-pointer" onClick={async () => { if (await confirmAction('Delete this leave application?')) { deleteLeaveApplication(leave.id); triggerToast('Leave Deleted.'); } }}><Trash size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovals;
