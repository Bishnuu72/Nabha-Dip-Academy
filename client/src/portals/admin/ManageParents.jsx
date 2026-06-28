import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash } from 'lucide-react';
import { inputCls, modalOverlayCls, modalFormCls, confirmAction } from './shared';

const ManageParents = () => {
  const { parents, students, addParent, updateParent, deleteParent } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', children: [] });
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [childClassFilter, setChildClassFilter] = useState('All');
  const [childSearch, setChildSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name, email: form.email, phone: form.phone,
      password: form.password || 'parent123',
      children: selectedChildren.map(roll => { const s = students.find(st => st.rollNumber === roll); return s ? { rollNumber: s.rollNumber, name: s.name, grade: s.grade } : { rollNumber: roll, name: roll, grade: '' }; })
    };
    if (editingId) { updateParent(editingId, payload); } else { addParent(payload); }
    setForm({ name: '', email: '', phone: '', password: '', children: [] });
    setSelectedChildren([]); setShowAdd(false); setEditingId(null);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Parent Guardians Directory</h3>
          <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => { setEditingId(null); setForm({ name: '', email: '', phone: '', password: '', children: [] }); setSelectedChildren([]); setShowAdd(true); }}><Plus size={13} /> Add Parent</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                {['Name', 'Email', 'Phone', 'Children', 'Action'].map(h => (<th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {parents.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                  <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="p-3.5 px-5 text-slate-500">{p.email}</td>
                  <td className="p-3.5 px-5 text-slate-500">{p.phone || '-'}</td>
                  <td className="p-3.5 px-5">
                    <div className="flex flex-wrap gap-1">{(p.children || []).length > 0 ? (p.children || []).map((c, i) => (<span key={i} className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-accent-light text-accent border-accent/20">{c.name} ({c.rollNumber})</span>)) : (<span className="text-[9px] text-slate-400">No children assigned</span>)}</div>
                  </td>
                  <td className="p-3.5 px-5">
                    <div className="flex gap-3 items-center">
                      <button data-tip="Edit" className="p-2 rounded-lg text-amber-500 hover:text-white hover:bg-amber-500 transition-all duration-150 cursor-pointer" onClick={() => { setEditingId(p.id); setForm({ name: p.name || '', email: p.email || '', phone: p.phone || '', password: p.password || '', children: (p.children || []).map(c => c.rollNumber) }); setSelectedChildren((p.children || []).map(c => c.rollNumber)); setShowAdd(true); }}><FileText size={15} /></button>
                      <button data-tip="Delete" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={async () => { if (await confirmAction('Delete Parent?')) deleteParent(p.id); }}><Trash size={15} /></button>
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
          <form onSubmit={handleSubmit} className={modalFormCls + ' max-w-lg'}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{editingId ? 'Update Parent' : 'Add Parent Guardian'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Full Name</label>
              <input type="text" className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Email</label>
              <input type="email" className={inputCls} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Phone</label>
                <input type="text" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Password</label>
                <input type="text" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Default: parent123" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Assign Children</label>
              <div className="flex gap-2 mb-2">
                <select className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold outline-none focus:border-accent flex-1" value={childClassFilter} onChange={(e) => setChildClassFilter(e.target.value)}>
                  <option value="All">All Classes</option>
                  {['Montessori','Nursery','LKG','UKG',...Array.from({length:10},(_,i)=>`Class ${i+1}`)].map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
                <input type="text" placeholder="Search by name/roll..." className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs outline-none focus:border-accent flex-[2]" value={childSearch} onChange={(e) => setChildSearch(e.target.value)} />
              </div>
              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-white dark:bg-slate-950">
                {students.length === 0 ? <p className="text-xs text-slate-400 p-2">No students available. Add students first.</p> : (() => {
                  const filtered = students.filter(s => (childClassFilter === 'All' || s.grade === childClassFilter) && (!childSearch || s.name.toLowerCase().includes(childSearch.toLowerCase()) || (s.rollNumber || '').toLowerCase().includes(childSearch.toLowerCase())));
                  return filtered.length === 0 ? <p className="text-xs text-slate-400 p-2">No matching students found.</p> : filtered.map(s => (
                    <label key={s.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      <input type="checkbox" className="accent-accent shrink-0" checked={selectedChildren.includes(s.rollNumber)} onChange={() => setSelectedChildren(prev => prev.includes(s.rollNumber) ? prev.filter(r => r !== s.rollNumber) : [...prev, s.rollNumber])} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">{s.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Roll: {s.rollNumber} | {s.grade}</span>
                      </div>
                    </label>
                  ));
                })()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{selectedChildren.length} student(s) selected</p>
            </div>
            <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">{editingId ? 'Update Parent' : 'Add Parent'}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageParents;
