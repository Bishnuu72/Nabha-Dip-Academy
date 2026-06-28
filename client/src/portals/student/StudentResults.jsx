import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Award, Printer, ShieldAlert } from 'lucide-react';

const StudentResults = () => {
  const { currentUser, results } = useContext(AppContext);

  const studentRoll = currentUser?.rollNumber || '1001';
  const studentId = currentUser?.id || 'S1001';
  const studentResult = results.find(r => r.rollNumber === studentRoll) || null;

  const handlePrintResults = () => {
    window.print();
  };

  const getGradePoint = (marks) => {
    if (marks >= 90) return 'A+ (4.0)';
    if (marks >= 80) return 'A (3.6)';
    if (marks >= 70) return 'B+ (3.2)';
    if (marks >= 60) return 'B (2.8)';
    return 'C (2.0)';
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {studentResult ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white leading-tight">{studentResult.examName} Report</h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Student ID: {studentId} | Roll No: {studentRoll}</span>
            </div>
            <button
              className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none print:hidden"
              onClick={handlePrintResults}
            >
              <Printer size={13} /> Print Report Sheet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60">
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Full Marks</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Pass Marks</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Score Scored</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Grade Point</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                {Object.entries(studentResult.marks).map(([subject, marks], index) => {
                  const gp = getGradePoint(marks);
                  return (
                    <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                      <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-slate-200">{subject}</td>
                      <td className="p-3.5 px-5 text-slate-500">100</td>
                      <td className="p-3.5 px-5 text-slate-500">40</td>
                      <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{marks}</td>
                      <td className="p-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300">{gp}</td>
                      <td className="p-3.5 px-5">
                        <span className={`
                          text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                          ${marks >= 40
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-455 border-emerald-55'
                            : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-55'}
                        `}>
                          {marks >= 40 ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-10 text-center shadow-xs flex flex-col items-center gap-3 text-slate-450">
          <ShieldAlert size={44} className="text-amber-500 shrink-0" />
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">No grading sheets found.</h3>
          <p className="text-xs">Examination cards are compiling. Please coordinate with class teachers.</p>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
