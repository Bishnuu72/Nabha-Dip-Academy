import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckCircle, XCircle, Undo2, Eye, Trash } from 'lucide-react';
import { statusBadge, modalOverlayCls, modalFormCls, confirmAction } from './shared';

const AdmissionsQueue = () => {
  const { applications, students, updateApplicationStatus, addStudent, permanentlyDeleteStudent, deleteApplication } = useContext(AppContext);

  const handleApprove = (app) => {
    updateApplicationStatus(app.id, 'approved');
    // Only add if student doesn't already exist (e.g. after a reset → re-approve)
    const existing = students.find(s => s.email === app.email);
    if (!existing) {
      addStudent({
        name: app.studentName, email: app.email, stream: app.stream || 'Primary',
        grade: app.grade || 'Class 5', rollNumber: String(1100 + students.length),
        parentEmail: app.parentEmail || 'guardian@example.com'
      });
    }
  };

  const handleReject = (appId) => {
    updateApplicationStatus(appId, 'rejected');
  };

  const handleReset = (app) => {
    updateApplicationStatus(app.id, 'pending');
    // Permanently delete the student from Manage Students so they vanish from the roster
    const student = students.find(s => s.email === app.email);
    if (student) {
      permanentlyDeleteStudent(student.id);
    }
  };

  const handleDelete = async (appId) => {
    if (await confirmAction('Delete this application permanently?')) {
      deleteApplication(appId);
    }
  };

  const [viewingApp, setViewingApp] = useState(null);

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Incoming Online Registrations Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                {['Candidate Name', 'Email', 'Grade Applied', 'Stream', 'Date', 'Status', 'Actions'].map(h => (<th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                  <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{app.studentName}</td>
                  <td className="p-3.5 px-5 text-slate-500">{app.email}</td>
                  <td className="p-3.5 px-5 text-slate-500">{app.grade || '\u2014'}</td>
                  <td className="p-3.5 px-5"><span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-accent-light text-accent border-accent/20">{app.stream}</span></td>
                  <td className="p-3.5 px-5 text-slate-500">{app.date}</td>
                  <td className="p-3.5 px-5"><span className={statusBadge(app.status)}>{app.status}</span></td>
                  <td className="p-3.5 px-5">
                    <div className="flex items-center gap-1">
                      <button data-tip="View" className="p-2 rounded-lg text-sky-500 hover:text-white hover:bg-sky-500 transition-all duration-150 cursor-pointer" onClick={() => setViewingApp(app)}><Eye size={15} /></button>
                      {app.status === 'pending' ? (
                        <>
                          <button data-tip="Approve" className="p-2 rounded-lg text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all duration-150 cursor-pointer" onClick={() => handleApprove(app)}><CheckCircle size={15} /></button>
                          <button data-tip="Reject" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={() => handleReject(app.id)}><XCircle size={15} /></button>
                        </>
                      ) : (
                        <button data-tip="Reset" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-400 transition-all duration-150 cursor-pointer" onClick={() => handleReset(app)}><Undo2 size={15} /></button>
                      )}
                      <button data-tip="Delete" className="p-2 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 transition-all duration-150 cursor-pointer" onClick={() => handleDelete(app.id)}><Trash size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingApp && (
        <div className={modalOverlayCls} onClick={() => setViewingApp(null)}>
          <div className={modalFormCls} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Application Details</h3>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Name" value={viewingApp.studentName} />
              <DetailRow label="Email" value={viewingApp.email} />
              <DetailRow label="Grade Applied" value={viewingApp.grade || '\u2014'} />
              <DetailRow label="Stream" value={viewingApp.stream || '\u2014'} />
              <DetailRow label="Date" value={viewingApp.date || '\u2014'} />
              <DetailRow label="Status" value={viewingApp.status} />
              {viewingApp.parentEmail && <DetailRow label="Parent Email" value={viewingApp.parentEmail} />}
              {viewingApp.phone && <DetailRow label="Phone" value={viewingApp.phone} />}
              {viewingApp.address && <DetailRow label="Address" value={viewingApp.address} />}
              {viewingApp.message && <DetailRow label="Message" value={viewingApp.message} />}
            </div>
            <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button className="py-2 px-5 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => setViewingApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wide shrink-0">{label}</span>
    <span className="font-semibold text-slate-900 dark:text-white text-right break-words">{value}</span>
  </div>
);

export default AdmissionsQueue;
