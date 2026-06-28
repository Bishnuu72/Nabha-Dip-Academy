import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar } from 'lucide-react';

const MarkAttendance = () => {
  const { currentUser, students, subjects, updateAttendance } = useContext(AppContext);

  const teacherSubjects = subjects.filter(s => s.instructor === currentUser.name);

  const [selectedCourse, setSelectedCourse] = useState('PHY-10');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [localAttendance, setLocalAttendance] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveAttendance = () => {
    students.forEach(student => {
      const status = localAttendance[student.rollNumber] || 'Present';
      updateAttendance(student.rollNumber, attendanceDate, status);
    });
    triggerToast('Attendance registry logged successfully!');
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <Calendar size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Register Sheet</h3>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Subject:</label>
              <select 
                className="p-1.5 rounded-lg border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs outline-none focus:border-accent"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {teacherSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Date:</label>
              <input 
                type="date" 
                className="p-1.5 rounded-lg border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-700 dark:text-slate-300 text-xs outline-none focus:border-accent"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Roll No</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Student Name</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Program Stream</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {students.map(student => {
                const status = localAttendance[student.rollNumber] || 'Present';
                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{student.rollNumber}</td>
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{student.name}</td>
                    <td className="p-3.5 px-5 text-slate-500">{student.stream}</td>
                    <td className="p-3.5 px-5">
                      <div className="flex gap-4">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            className="accent-accent"
                            name={`attendance-${student.rollNumber}`} 
                            checked={status === 'Present'}
                            onChange={() => setLocalAttendance({ ...localAttendance, [student.rollNumber]: 'Present' })}
                          />
                          Present
                        </label>
                        <label className="text-xs font-bold text-rose-600 dark:text-rose-450 flex items-center gap-1.5 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            className="accent-rose-500"
                            name={`attendance-${student.rollNumber}`} 
                            checked={status === 'Absent'}
                            onChange={() => setLocalAttendance({ ...localAttendance, [student.rollNumber]: 'Absent' })}
                          />
                          Absent
                        </label>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
          <button className="py-2.5 px-6 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center gap-2 cursor-pointer shadow-xs transition-colors outline-none" onClick={handleSaveAttendance}>
            Submit Daily Attendance Registry
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
