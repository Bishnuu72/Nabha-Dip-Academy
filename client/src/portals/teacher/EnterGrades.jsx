import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Award } from 'lucide-react';

const EnterGrades = () => {
  const { students, enterMarks } = useContext(AppContext);

  const [marksStudentRoll, setMarksStudentRoll] = useState('1001');
  const [marksExamName, setMarksExamName] = useState('First Term Exams');
  const [subjectMarks, setSubjectMarks] = useState({
    'Science': '',
    'Mathematics': '',
    'English': '',
    'Nepali': '',
    'Social Studies': ''
  });
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleMarksSubmit = (e) => {
    e.preventDefault();
    const parsedMarks = {};
    Object.entries(subjectMarks).forEach(([sub, val]) => {
      parsedMarks[sub] = val ? Number(val) : 0;
    });
    enterMarks(marksStudentRoll, marksExamName, parsedMarks);
    triggerToast('Grades entered successfully for this student!');
    setSubjectMarks({
      'Science': '',
      'Mathematics': '',
      'English': '',
      'Nepali': '',
      'Social Studies': ''
    });
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] max-w-2xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <Award size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-805 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">
          Exam Grades Sheet Entry
        </h3>
        <form onSubmit={handleMarksSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Select Student</label>
              <select 
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                value={marksStudentRoll}
                onChange={(e) => setMarksStudentRoll(e.target.value)}
              >
                {students.map(s => (
                  <option key={s.id} value={s.rollNumber}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Exam Name</label>
              <select 
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                value={marksExamName}
                onChange={(e) => setMarksExamName(e.target.value)}
              >
                <option value="First Term Exams">First Term Exams</option>
                <option value="Second Term Exams">Second Term Exams</option>
                <option value="Final Term Board">Final Term Board</option>
              </select>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Enter Subject Scores (Out of 100)</h4>
            
            <div className="flex flex-col gap-3">
              {Object.keys(subjectMarks).map(subject => (
                <div key={subject} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-850">
                  <span className="font-semibold text-slate-800 dark:text-slate-300 text-sm">{subject}</span>
                  <input 
                    type="number" 
                    max="100" 
                    min="0"
                    className="w-24 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-350 text-sm outline-none text-center focus:border-accent" 
                    required
                    value={subjectMarks[subject]}
                    onChange={(e) => setSubjectMarks({ ...subjectMarks, [subject]: e.target.value })}
                    placeholder="Score"
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors mt-4 outline-none">
            Publish Marks ledger to Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterGrades;
