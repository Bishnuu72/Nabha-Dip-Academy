import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar, Award } from 'lucide-react';

const StudentAttendance = () => {
  const { currentUser, attendance } = useContext(AppContext);

  const studentRoll = currentUser?.rollNumber || '1001';
  const studentAttendance = attendance[studentRoll] || [];
  const presentDays = studentAttendance.filter(r => r.status === 'Present').length;
  const totalDays = studentAttendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-xs">
        <div
          className="relative w-28 h-28 rounded-full flex items-center justify-center mb-4 shrink-0 shadow-xs"
          style={{
            background: `conic-gradient(var(--color-success, #10b981) 0% ${attendanceRate}%, #e2e8f0 ${attendanceRate}% 100%)`
          }}
        >
          <div className="absolute w-22 h-22 rounded-full bg-white dark:bg-slate-900"></div>
          <span className="relative z-10 text-xl font-extrabold text-slate-900 dark:text-white">{attendanceRate}%</span>
        </div>
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-0.5">Presence Metric</h4>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Required presence: 75%</p>
      </div>

      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Daily Attendance Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                <th className="p-3 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Date</th>
                <th className="p-3 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Day</th>
                <th className="p-3 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                <th className="p-3 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {studentAttendance.map((record, index) => {
                const dayName = days[new Date(record.date).getDay()];
                return (
                  <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3 px-5 font-bold text-slate-800 dark:text-slate-250">{record.date}</td>
                    <td className="p-3 px-5">{dayName}</td>
                    <td className="p-3 px-5">
                      <span className={`
                        text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                        ${record.status === 'Present'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-55'}
                      `}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-3 px-5 text-xs text-slate-450">{record.status === 'Present' ? 'On Time' : 'Absent'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
