import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Undo2, Trash } from 'lucide-react';
import { confirmAction } from './shared';

const DeletedStudents = () => {
  const { deletedStudents, restoreStudent, permanentlyDeleteStudent, bulkRestoreStudents, bulkPermanentDeleteStudents } = useContext(AppContext);
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === deletedStudents.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(deletedStudents.map(s => s.id)));
    }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">
            Deleted Students ({deletedStudents.length})
          </h3>
          <p className="text-xs text-slate-400 mt-1">Restore a student to return them to the active roster.</p>
        </div>

        {selected.size > 0 && (
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/15 border-b border-amber-200 dark:border-amber-950/30 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{selected.size} selected</span>
            <button className="py-1.5 px-3 rounded-lg font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer" onClick={async () => { if (await confirmAction(`Restore ${selected.size} students?`)) { bulkRestoreStudents([...selected]); setSelected(new Set()); } }}>
              <Undo2 size={12} className="inline mr-1" /> Restore Selected
            </button>
            <button className="py-1.5 px-3 rounded-lg font-bold text-xs bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer" onClick={async () => { if (await confirmAction(`Permanently delete ${selected.size} students? This cannot be undone.`)) { bulkPermanentDeleteStudents([...selected]); setSelected(new Set()); } }}>
              <Trash size={12} className="inline mr-1" /> Delete Permanently
            </button>
          </div>
        )}

        {deletedStudents.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400 font-semibold">No deleted students.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/60">
                  <th className="p-3.5 px-4 w-10">
                    <input type="checkbox" className="cursor-pointer" checked={selected.size === deletedStudents.length && deletedStudents.length > 0} onChange={toggleSelectAll} />
                  </th>
                  {['Roll Number', 'Full Name', 'Email Address', 'Program Stream', 'Grade Level', 'Action'].map(h => (
                    <th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                {deletedStudents
                  .sort((a, b) => {
                    const na = parseInt(a.rollNumber) || 0;
                    const nb = parseInt(b.rollNumber) || 0;
                    return na - nb;
                  })
                  .map(s => (
                  <tr key={s.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors opacity-70 ${selected.has(s.id) ? 'bg-accent-light/30 dark:bg-amber-950/10 opacity-90' : ''}`}>
                    <td className="p-3.5 px-4">
                      <input type="checkbox" className="cursor-pointer" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                    </td>
                    <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{s.rollNumber}</td>
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {s.profileImage ? <img src={s.profileImage} alt={s.name} className="w-9 h-9 rounded-full object-cover border" /> : <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 text-white flex items-center justify-center font-bold">{(s.name || 'S').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>}
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 px-5 text-slate-500">{s.email}</td>
                    <td className="p-3.5 px-5"><span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-red-50 dark:bg-red-950/20 text-red-500 border-red-200/30">{s.stream}</span></td>
                    <td className="p-3.5 px-5 text-slate-500">{s.grade}</td>
                    <td className="p-3.5 px-5">
                      <div className="flex gap-3 items-center">
                        <button className="text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1" onClick={async () => { if (await confirmAction(`Restore ${s.name}?`)) restoreStudent(s.id); }}><Undo2 size={15} /> Restore</button>
                        <button className="text-rose-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1" onClick={async () => { if (await confirmAction(`Permanently delete ${s.name}? This cannot be undone.`)) permanentlyDeleteStudent(s.id); }}><Trash size={15} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedStudents;
