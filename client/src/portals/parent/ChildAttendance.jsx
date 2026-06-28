import React, { useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Calendar, Award } from 'lucide-react';

const ChildAttendance = () => {
  const { currentUser, students, attendance } = useContext(AppContext);

  const { selectedChildRoll, childInfo } = useOutletContext();
  const childRoll = selectedChildRoll;

  const childAttendance = attendance[childRoll] || [];
  const presentDays = childAttendance.filter(r => r.status === 'Present').length;
  const totalDays = childAttendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Monthly Presence Log sheet ({childInfo?.name || '--'})</h3>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55">
            Rate: {attendanceRate}%
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Date</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Attendance Status</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {childAttendance.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                  <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{rec.date}</td>
                  <td className="p-3.5 px-5">
                    <span className={`
                      text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                      ${rec.status === 'Present'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55'
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-55'}
                    `}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="p-3.5 px-5 text-slate-500 text-xs">{rec.status === 'Present' ? 'Checked in 8:00 AM' : 'Excused leave pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChildAttendance;
