import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { FileText, CheckCircle } from 'lucide-react';

const StudentAssignments = () => {
  const { currentUser, assignments, submissions, submitAssignment } = useContext(AppContext);

  const studentId = currentUser?.id || 'S1001';
  const studentSubmissions = submissions.filter(s => s.studentId === studentId);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [uploadFile, setUploadFile] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    submitAssignment({
      assignmentId: selectedAssignmentId,
      studentId: studentId,
      studentName: currentUser.name,
      fileName: uploadFile.split('\\').pop() || 'assignment_submission.pdf'
    });

    setUploadFile('');
    setSelectedAssignmentId(null);
    setShowToast(true);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {showToast && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>Assignment uploaded successfully!</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Outstanding Home Assignments</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject / Class</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Assignment details</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Due Date</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Teacher</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Grades / Feedbacks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {assignments.map(ass => {
                const sub = studentSubmissions.find(s => s.assignmentId === ass.id);
                return (
                  <tr key={ass.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-slate-200 shrink-0">{ass.subjectName || ass.courseName || '-'}</td>
                    <td className="p-3.5 px-5 max-w-xs">
                      <strong className="text-slate-800 dark:text-slate-100 font-bold block">{ass.title}</strong>
                      <span className="text-[11px] text-slate-450 dark:text-slate-500 leading-normal block mt-1">{ass.description}</span>
                    </td>
                    <td className="p-3.5 px-5 text-slate-500 whitespace-nowrap">{ass.dueDate}</td>
                    <td className="p-3.5 px-5">{ass.teacherName}</td>
                    <td className="p-3.5 px-5">
                      <span className={`
                        text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                        ${sub
                          ? (sub.status === 'Graded' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55' : 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 border-blue-55')
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-55'}
                      `}>
                        {sub ? sub.status : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3.5 px-5">
                      {sub ? (
                        sub.status === 'Graded' ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-extrabold text-emerald-500 text-sm">{sub.score} / 100</span>
                            <p className="text-[10px] text-slate-400 dark:text-slate-550 italic leading-snug">"{sub.feedback}"</p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-450 italic">Awaiting grade</span>
                        )
                      ) : (
                        <button
                          className="py-1 px-3 rounded font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer"
                          onClick={() => setSelectedAssignmentId(ass.id)}
                        >
                          Submit File
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

      {selectedAssignmentId && (
        <div className="fixed inset-0 w-full h-full bg-slate-950/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAssignmentSubmit}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl w-full max-w-sm relative shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-[fadeIn_0.2s_forwards]"
          >
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Submit Assignment File
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Select Scanned Document (PDF/DOCX)</label>
              <input
                type="file"
                className="w-full p-2 border border-slate-250 dark:border-slate-800 rounded-lg text-xs dark:bg-slate-950 outline-none"
                onChange={(e) => setUploadFile(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">
                Submit Homework
              </button>
              <button
                type="button"
                className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-105 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer outline-none"
                onClick={() => { setSelectedAssignmentId(null); setUploadFile(''); }}
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

export default StudentAssignments;
