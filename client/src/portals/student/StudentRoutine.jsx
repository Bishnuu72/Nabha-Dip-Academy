import React from 'react';

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

const StudentRoutine = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-[fadeIn_0.2s_ease-out_forwards] select-none">
      {Object.entries(routineData).map(([day, periods], idx) => (
        <div key={idx} className="flex flex-col">
          <h4 className="bg-slate-900 text-white dark:bg-slate-850 p-2.5 text-center text-xs font-bold rounded-lg mb-3 tracking-wide">{day}</h4>
          <div className="flex flex-col gap-3">
            {periods.map((p, pIdx) => (
              <div key={pIdx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-3.5 text-[11px] border-l-4 border-l-accent shadow-xs flex flex-col gap-1.5">
                <div className="font-bold text-accent">{p.time}</div>
                <div className="font-extrabold text-slate-900 dark:text-white leading-tight">{p.subject}</div>
                <div className="text-slate-400 dark:text-slate-500 font-medium">Inst: {p.inst}</div>
                <div className="text-[9px] font-bold bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 self-start mt-1">Room: {p.room}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentRoutine;
