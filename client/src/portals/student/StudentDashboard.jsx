import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar, Award, BookOpen, FileText } from 'lucide-react';

const routineData = {
  Sunday: [
    { time: '09:30 AM - 10:30 AM', subject: 'Science X', room: 'Class 10', inst: 'Dr. Anand Verma' },
    { time: '10:45 AM - 11:45 AM', subject: 'English X', room: 'Class 10', inst: 'Ms. Emily Blunt' }
  ],
  Monday: [
    { time: '09:30 AM - 10:30 AM', subject: 'Mathematics X', room: 'Class 10', inst: 'Dr. Anand Verma' },
    { time: '12:00 PM - 01:00 PM', subject: 'Nepali X', room: 'Class 10', inst: 'Ms. Emily Blunt' }
  ],
  Tuesday: [
    { time: '09:30 AM - 10:30 AM', subject: 'Science X', room: 'Lab A', inst: 'Dr. Anand Verma' },
    { time: '10:45 AM - 11:45 AM', subject: 'English X', room: 'Class 10', inst: 'Ms. Emily Blunt' }
  ],
  Wednesday: [
    { time: '09:30 AM - 10:30 AM', subject: 'Mathematics X', room: 'Class 10', inst: 'Dr. Anand Verma' },
    { time: '12:00 PM - 01:00 PM', subject: 'Social Studies X', room: 'Class 10', inst: 'Ms. Emily Blunt' }
  ],
  Thursday: [
    { time: '10:45 AM - 11:45 AM', subject: 'Nepali X', room: 'Class 10', inst: 'Ms. Emily Blunt' },
    { time: '12:00 PM - 01:00 PM', subject: 'Weekly Lab Assessment', room: 'Science Lab', inst: 'Dr. Anand Verma' }
  ]
};

const StudentDashboard = () => {
  const { currentUser, attendance, assignments, results, submissions, notices } = useContext(AppContext);

  const studentRoll = currentUser?.rollNumber || '1001';
  const studentId = currentUser?.id || 'S1001';
  const studentAttendance = attendance[studentRoll] || [];
  const presentDays = studentAttendance.filter(r => r.status === 'Present').length;
  const totalDays = studentAttendance.length || 1;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);
  const studentResult = results.find(r => r.rollNumber === studentRoll) || null;
  const studentSubmissions = submissions.filter(s => s.studentId === studentId);

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { val: `${attendanceRate}%`, lbl: 'Attendance Rate', icon: Calendar },
          { val: assignments.length - studentSubmissions.length, lbl: 'Due Assignments', icon: FileText },
          { val: studentResult ? Object.keys(studentResult.marks).length : 0, lbl: 'Subjects Evaluated', icon: Award },
          { val: 'Grade A', lbl: 'Current Standing', icon: Award }
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
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Recent School Notices</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {notices.slice(0, 3).map(notice => (
              <div key={notice.id} className="pb-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-wider">{notice.category}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{notice.date}</span>
                </div>
                <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-snug">{notice.title}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Lectures (Monday)</h3>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {routineData.Monday.map((r, idx) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200/50 dark:border-slate-850 border-l-4 border-l-accent">
                <div className="flex justify-between font-bold text-[10px] text-accent mb-1 uppercase tracking-wide">
                  <span>{r.time}</span>
                  <span>{r.room}</span>
                </div>
                <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-tight">{r.subject}</h4>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 block mt-0.5">Instructor: {r.inst}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
