import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FileText, Upload, CheckCircle } from 'lucide-react';

const AssignmentsDesk = () => {
  const { assignments, addAssignment, submissions, gradeSubmission, subjects, currentUser } = useContext(AppContext);

  const teacherSubjects = subjects.filter(s => s.instructor === currentUser.name);

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subjectName: 'Science X (Physics)',
    dueDate: ''
  });
  const [gradingSubId, setGradingSubId] = useState(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    addAssignment({
      title: newAssignment.title,
      description: newAssignment.description,
      subjectName: newAssignment.subjectName,
      dueDate: newAssignment.dueDate
    });
    triggerToast('New assignment posted for students!');
    setNewAssignment({
      title: '',
      description: '',
      subjectName: 'Science X (Physics)',
      dueDate: ''
    });
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    gradeSubmission(gradingSubId, gradeScore, gradeFeedback);
    triggerToast('Submission marked and feedback dispatched!');
    setGradingSubId(null);
    setGradeScore('');
    setGradeFeedback('');
  };

  return (
    <div className="flex flex-col gap-8 animate-[fadeIn_0.2s_ease-out_forwards]">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 md:p-6 border border-slate-200 dark:border-slate-805 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
            Post New Homework Assignment
          </h3>
          <form onSubmit={handleCreateAssignment} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Assignment Title</label>
              <input 
                type="text" 
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                value={newAssignment.title} 
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} 
                placeholder="e.g. Electromagnetic Induction Lab Report" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Task Description</label>
              <textarea 
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent resize-y" 
                value={newAssignment.description} 
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} 
                placeholder="Input requirements, formulas, and submission format guidelines..." 
                rows="3"
                required 
              ></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Subject</label>
                <select 
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                  value={newAssignment.subjectName}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subjectName: e.target.value })}
                >
                  {teacherSubjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.grade})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Due Date</label>
                <input 
                  type="date" 
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                  value={newAssignment.dueDate} 
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} 
                  required 
                />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors outline-none">
              <Upload size={14} /> Distribute to Students
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Currently Distributed Tasks</h3>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {assignments.map(ass => (
              <div key={ass.id} className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200/50 dark:border-slate-850 border-l-4 border-l-accent flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-accent font-bold uppercase tracking-wide">
                  <span>Subject: {ass.subjectName || ass.courseName || '-'}</span>
                  <span>Due: {ass.dueDate}</span>
                </div>
                <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">{ass.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Incoming Student Uploads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-955/60">
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Student ID</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Student Name</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Submitted File</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Upload Date</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Grades / Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {submissions.map(sub => {
                const assDetails = assignments.find(a => a.id === sub.assignmentId);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{sub.studentId}</td>
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{sub.studentName}</td>
                    <td className="p-3.5 px-5">
                      <a href="#" className="font-bold text-accent hover:underline" onClick={(e) => { e.preventDefault(); alert(`Opening document file: ${sub.fileName}`); }}>
                        {sub.fileName}
                      </a>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">Task: {assDetails?.title}</p>
                    </td>
                    <td className="p-3.5 px-5 text-slate-500">{sub.submissionDate}</td>
                    <td className="p-3.5 px-5">
                      <span className={`
                        text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                        ${sub.status === 'Graded' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55' 
                          : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border-blue-55'}
                      `}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3.5 px-5">
                      {sub.status === 'Graded' ? (
                        <div className="flex flex-col gap-0.5">
                          <strong className="text-emerald-600 dark:text-emerald-450 font-bold">{sub.score} / 100</strong>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">"{sub.feedback}"</p>
                        </div>
                      ) : (
                        <button 
                          className="py-1 px-3 rounded font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer" 
                          onClick={() => setGradingSubId(sub.id)}
                        >
                          Grade File
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {gradingSubId && (
        <div className="fixed inset-0 w-full h-full bg-slate-950/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <form 
            onSubmit={handleGradeSubmit} 
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl w-full max-w-md relative shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-[fadeIn_0.2s_forwards]"
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Grade Submission Sheet
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Score (0 - 100)</label>
              <input 
                type="number" 
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                max="100" 
                min="0"
                value={gradeScore} 
                onChange={(e) => setGradeScore(e.target.value)} 
                placeholder="e.g. 85"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Reviewer Feedback</label>
              <textarea 
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent resize-y" 
                value={gradeFeedback} 
                onChange={(e) => setGradeFeedback(e.target.value)} 
                placeholder="Critique student work quality and suggest improvements..." 
                rows="4" 
                required 
              ></textarea>
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">
                Submit Grade Registry
              </button>
              <button 
                type="button" 
                className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer outline-none" 
                onClick={() => { setGradingSubId(null); setGradeScore(''); setGradeFeedback(''); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssignmentsDesk;
