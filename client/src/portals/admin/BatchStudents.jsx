import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ArrowLeft, GraduationCap, Undo2, Pencil, Trash } from 'lucide-react';
import { confirmAction } from './shared';

const BatchStudents = () => {
  const { batchCompletedStudents, restoreFromBatch, renameBatch, removeBatch } = useContext(AppContext);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const grouped = {};
  batchCompletedStudents.forEach(s => {
    const name = s.batchCompleted?.name || 'Unknown';
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(s);
  });

  const sortedBatches = Object.keys(grouped).sort().reverse();

  if (selectedBatch) {
    const students = grouped[selectedBatch] || [];
    return (
      <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent transition-colors mb-4 cursor-pointer" onClick={() => setSelectedBatch(null)}>
          <ArrowLeft size={14} /> Back to Batches
        </button>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/15 dark:to-teal-950/15">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-500" />
              Batch {selectedBatch}
            </h3>
            <p className="text-xs text-slate-400 mt-1">{students.length} student{students.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60">
                  {['Roll Number', 'Full Name', 'Email Address', 'Program Stream', 'Grade Level', 'Completed On', 'Action'].map(h => (
                    <th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                {students
                  .sort((a, b) => {
                    const na = parseInt(a.rollNumber) || 0;
                    const nb = parseInt(b.rollNumber) || 0;
                    return na - nb;
                  })
                  .map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{s.rollNumber}</td>
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {s.profileImage ? <img src={s.profileImage} alt={s.name} className="w-9 h-9 rounded-full object-cover border" /> : <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">{(s.name || 'S').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>}
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 px-5 text-slate-500">{s.email}</td>
                    <td className="p-3.5 px-5"><span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/30">{s.stream}</span></td>
                    <td className="p-3.5 px-5 text-slate-500">{s.grade}</td>
                    <td className="p-3.5 px-5 text-slate-500">{s.batchCompleted?.date ? new Date(s.batchCompleted.date).toLocaleDateString() : '-'}</td>
                    <td className="p-3.5 px-5">
                      <button className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1" onClick={async () => { if (await confirmAction(`Restore ${s.name} to active roster?`)) restoreFromBatch(s.id); }}>
                        <Undo2 size={14} /> Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">10th Batch Students</h3>
          <p className="text-xs text-slate-400 mt-1">{batchCompletedStudents.length} graduated student{batchCompletedStudents.length !== 1 ? 's' : ''} across {sortedBatches.length} batch{sortedBatches.length !== 1 ? 'es' : ''}.</p>
        </div>
        {sortedBatches.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400 font-semibold">No batch-completed students yet.</div>
        ) : (
          <div className="p-5 space-y-3">
            {sortedBatches.map(batchName => (
              <div key={batchName} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-all">
                {editingBatch === batchName ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                      value={renameInput}
                      onChange={e => setRenameInput(e.target.value)}
                      autoFocus
                    />
                    <button className="py-1.5 px-3 rounded-lg font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer" onClick={async () => {
                      if (renameInput.trim() && renameInput.trim() !== batchName) {
                        if (await confirmAction(`Rename batch "${batchName}" to "${renameInput.trim()}"?`)) {
                          renameBatch(grouped[batchName].map(s => s.id), renameInput.trim());
                        }
                      }
                      setEditingBatch(null);
                      setRenameInput('');
                    }}>Save</button>
                    <button className="py-1.5 px-3 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer" onClick={() => { setEditingBatch(null); setRenameInput(''); }}>Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setSelectedBatch(batchName)}>
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                        <GraduationCap size={18} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Batch {batchName}</h4>
                        <p className="text-xs text-slate-400">{grouped[batchName].length} student{grouped[batchName].length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-amber-500 hover:text-white hover:bg-amber-500 transition-all duration-150 cursor-pointer" data-tip="Rename" onClick={() => { setEditingBatch(batchName); setRenameInput(batchName); }}>
                        <Pencil size={14} />
                      </button>
                      <button className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" data-tip="Remove" onClick={async () => {
                        if (await confirmAction(`Remove batch "${batchName}" for all ${grouped[batchName].length} students? They will return to the active roster.`, 'Yes, remove')) {
                          removeBatch(grouped[batchName].map(s => s.id));
                        }
                      }}>
                        <Trash size={14} />
                      </button>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">&rarr;</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchStudents;
