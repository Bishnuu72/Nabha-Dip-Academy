import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash } from 'lucide-react';
import { inputCls, modalOverlayCls, modalFormCls, confirmAction } from './shared';

const GRADES = [
  'Montessori', 'Nursery', 'LKG', 'UKG',
  ...[1,2,3,4,5,6,7,8,9,10].map(n => `Class ${n}`)
];

const ManageSubjects = () => {
  const { subjects, teachers, addSubject, updateSubject, deleteSubject } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterGrade, setFilterGrade] = useState('All');
  const [form, setForm] = useState({ name: '', code: '', stream: 'Secondary', grade: 'Class 10', instructor: 'Dr. Anand Verma' });

  const filtered = filterGrade === 'All'
    ? subjects
    : subjects.filter(s => s.grade === filterGrade);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.code) data.code = '';
    if (editingId) { updateSubject(editingId, data); } else { addSubject(data); }
    setForm({ name: '', code: '', stream: 'Secondary', grade: filterGrade !== 'All' ? filterGrade : 'Class 10', instructor: 'Dr. Anand Verma' });
    setShowAdd(false); setEditingId(null);
  };

  const openAddForm = (grade) => {
    setEditingId(null);
    setForm({ name: '', code: '', stream: grade === 'Montessori' ? 'Montessori' : grade === 'Nursery' || grade === 'LKG' || grade === 'UKG' ? 'Pre-Primary' : grade.startsWith('Class') && parseInt(grade.split(' ')[1]) <= 5 ? 'Primary' : 'Secondary', grade, instructor: 'Dr. Anand Verma' });
    setShowAdd(true);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] flex flex-col gap-5">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Curriculum Subjects</h3>
          <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5"
            onClick={() => openAddForm(filterGrade !== 'All' ? filterGrade : 'Class 10')}>
            <Plus size={13} /> Add Subject
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 dark:border-slate-800/40 flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Filter by Class:</label>
          <select className={`${inputCls} w-auto min-w-[140px]`} value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
            <option value="All">All Classes</option>
            {GRADES.map(g => (<option key={g} value={g}>{g}</option>))}
          </select>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-auto">
            {filtered.length} subject{filtered.length !== 1 ? 's' : ''}
            {filterGrade !== 'All' && <> for <strong className="text-slate-600 dark:text-slate-300">{filterGrade}</strong></>}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                {['Subject Code', 'Subject Name', 'Stream', 'Grade Level', 'Lead Instructor', 'Action'].map(h => (
                  <th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                    No subjects found.
                    {filterGrade !== 'All' && (
                      <button className="ml-2 text-accent hover:underline font-semibold cursor-pointer outline-none"
                        onClick={() => openAddForm(filterGrade)}>Add one now</button>
                    )}
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                  <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{s.code || s.id || '-'}</td>
                  <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="p-3.5 px-5"><span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-accent-light text-accent border-accent/20">{s.stream}</span></td>
                  <td className="p-3.5 px-5 text-slate-500">{s.grade}</td>
                  <td className="p-3.5 px-5 text-slate-500">{s.instructor}</td>
                  <td className="p-3.5 px-5">
                    <div className="flex gap-3 items-center">
                      <button data-tip="Edit" className="p-2 rounded-lg text-amber-500 hover:text-white hover:bg-amber-500 transition-all duration-150 cursor-pointer" onClick={() => { setEditingId(s.id); setForm({ name: s.name || '', code: s.code || s.id || '', stream: s.stream || 'Secondary', grade: s.grade || 'Class 10', instructor: s.instructor || 'Dr. Anand Verma' }); setShowAdd(true); }}><FileText size={15} /></button>
                      <button data-tip="Delete" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={async () => { if (await confirmAction('Delete this subject?')) deleteSubject(s.id); }}><Trash size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className={modalOverlayCls}>
          <form onSubmit={handleSubmit} className={modalFormCls}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{editingId ? 'Update Subject Record' : 'Create Subject Record'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Subject Name</label>
              <input type="text" className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Science X (Physics)" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Subject Code</label>
                <input type="text" className={inputCls} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. PHY-10" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Stream</label>
                <select className={inputCls} value={form.stream} onChange={(e) => setForm({ ...form, stream: e.target.value })}>
                  <option value="Montessori">Montessori</option>
                  <option value="Pre-Primary">Pre-Primary</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="All Streams">All Streams</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Grade / Class</label>
              <select className={inputCls} value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                {GRADES.map(g => (<option key={g} value={g}>{g}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Lead Instructor</label>
              <select className={inputCls} value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })}>
                {teachers.map(t => (<option key={t.id} value={t.name}>{t.name}</option>))}
              </select>
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">{editingId ? 'Update Subject' : 'Create Subject'}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageSubjects;
