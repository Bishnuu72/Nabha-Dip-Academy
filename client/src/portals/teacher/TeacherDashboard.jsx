import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { ClipboardList, Users, FileText, Award } from 'lucide-react';

const TeacherDashboard = () => {
  const { currentUser, students, subjects, submissions } = useContext(AppContext);

  const teacherSubjects = subjects.filter(c => c.instructor === currentUser.name);
  const totalStudents = students.length;
  const pendingGradesCount = submissions.filter(s => s.status === 'Submitted').length;

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { val: teacherSubjects.length, lbl: 'Assigned Subjects', icon: ClipboardList },
          { val: totalStudents, lbl: 'Students Under Mentor', icon: Users },
          { val: pendingGradesCount, lbl: 'Pending Submissions', icon: FileText },
          { val: '100%', lbl: 'Grades Dispatched', icon: Award }
        ].map((kpi, idx) => {
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
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">My Subject Allocation</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60">
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject Code</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject Name</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Class Room</th>
                  <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Class Stream</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                {teacherSubjects.map(subject => (
                  <tr key={subject.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-slate-200">{subject.code || subject.id || '-'}</td>
                    <td className="p-3.5 px-5 text-slate-700 dark:text-slate-300 font-semibold">{subject.name}</td>
                    <td className="p-3.5 px-5">{subject.grade || 'Class 10'} (Room 3)</td>
                    <td className="p-3.5 px-5">
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55">{subject.stream}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Quick Student Tasks Needs Grading</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {submissions.filter(s => s.status === 'Submitted').length > 0 ? (
              submissions.filter(s => s.status === 'Submitted').map(sub => (
                <div key={sub.id} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">{sub.studentName}</h4>
                    <span className="text-[10px] text-slate-455 dark:text-slate-500 font-medium block">File: {sub.fileName}</span>
                  </div>
                  <button 
                    className="py-1 px-3 rounded font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer"
                    onClick={() => {/* Grade Now - navigation handled in AssignmentsDesk */}}
                  >
                    Grade Now
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
                All student submissions graded! Nice job.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
