import React, { useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Award, ShieldAlert } from 'lucide-react';

const AcademicProgress = () => {
  const { currentUser, students, results } = useContext(AppContext);

  const { selectedChildRoll, childInfo } = useOutletContext();
  const childRoll = selectedChildRoll;

  const childResult = results.find(r => r.rollNumber === childRoll) || null;

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {childResult ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">{childResult.examName} Report Card</h3>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-accent-light text-accent border-accent/20">
              Semester Standing: A
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60">
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Total Marks</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Obtained Marks</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Grade Equivalent</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                {Object.entries(childResult.marks).map(([subj, mark], idx) => {
                  const grp = (mark >= 90) ? 'A+' : (mark >= 80) ? 'A' : (mark >= 70) ? 'B+' : 'B';
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                      <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{subj}</td>
                      <td className="p-3.5 px-5 text-slate-500">100</td>
                      <td className="p-3.5 px-5 font-bold text-accent">{mark}</td>
                      <td className="p-3.5 px-5 text-slate-700 dark:text-slate-300">{grp}</td>
                      <td className="p-3.5 px-5 text-slate-500">{subj === 'Science' || subj === 'Mathematics' ? 'Dr. Anand Verma' : 'Ms. Emily Blunt'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-10 text-center shadow-xs flex flex-col items-center gap-3 text-slate-450">
          <ShieldAlert size={48} className="text-amber-500 shrink-0" />
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">No grade records posted yet.</h3>
          <p className="text-xs text-slate-400">Examination cards are compiling. Please coordinate with class teachers.</p>
        </div>
      )}
    </div>
  );
};

export default AcademicProgress;
