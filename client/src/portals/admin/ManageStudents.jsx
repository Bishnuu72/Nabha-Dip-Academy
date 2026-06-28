import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash, Archive, GraduationCap, X, Eye } from 'lucide-react';
import { inputCls, modalOverlayCls, modalFormCls, compressImage, confirmAction } from './shared';
import { ImageModal } from './SharedComponents';
import { useNavigate } from 'react-router-dom';

const ManageStudents = () => {
  const { students, addStudent, updateStudent, deleteStudent, bulkDeleteStudents, markBatchCompleted, batchCompletedStudents } = useContext(AppContext);
  const navigate = useNavigate();
  const [classFilter, setClassFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', stream: 'Secondary', grade: 'Class 10', rollNumber: '', parentEmail: '', profileImage: '' });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageModalUrl, setImageModalUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchNameInput, setBatchNameInput] = useState('');
  const [existingBatch, setExistingBatch] = useState('');
  const [viewingStudent, setViewingStudent] = useState(null);

  const existingBatchNames = [...new Set(batchCompletedStudents.map(s => s.batchCompleted?.name).filter(Boolean))].sort();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let profileImage = form.profileImage || '';
      if (file) {
        profileImage = await compressImage(file);
      }
      const data = { ...form, profileImage };
      if (editingId) {
        await updateStudent(editingId, data);
      } else {
        await addStudent(data);
      }
      setShowAdd(false);
      setEditingId(null);
      setFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Student save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatchSubmit = async () => {
    const name = batchNameInput.trim() || existingBatch;
    if (!name) return;
    if (await confirmAction(`Mark ${selected.size} students as completed 10th batch "${name}"?`)) {
      markBatchCompleted([...selected], name);
      setSelected(new Set());
      setShowBatchModal(false);
      setBatchNameInput('');
      setExistingBatch('');
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredStudents.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const filteredStudents = students
    .filter(s => classFilter === 'All' || s.grade === classFilter)
    .sort((a, b) => {
      const na = parseInt(a.rollNumber) || 0;
      const nb = parseInt(b.rollNumber) || 0;
      return na - nb;
    });

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Active Student Roster</h3>
          <div className="flex items-center gap-3">
            <select className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold outline-none focus:border-accent" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="All">All Classes</option>
              <option value="Montessori">Montessori</option>
              <option value="Nursery">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (<option key={n} value={`Class ${n}`}>Class {n}</option>))}
            </select>
            <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-rose-500 text-white hover:bg-rose-600 transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => navigate('/portal/admin/deleted-students')}>
              <Archive size={13} /> Deleted
            </button>
            <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: 's-' + Math.random().toString(36).slice(2, 8), stream: 'Secondary', grade: 'Class 10', rollNumber: '', parentEmail: '', profileImage: '' }); setShowAdd(true); }}>
              <Plus size={13} /> Add Student
            </button>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/15 border-b border-amber-200 dark:border-amber-950/30 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{selected.size} selected</span>
            <button className="py-1.5 px-3 rounded-lg font-bold text-xs bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer" onClick={async () => { if (await confirmAction(`Delete ${selected.size} students?`)) { bulkDeleteStudents([...selected]); setSelected(new Set()); } }}>
              <Trash size={12} className="inline mr-1" /> Delete Selected
            </button>
            <button className="py-1.5 px-3 rounded-lg font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer" onClick={() => setShowBatchModal(true)}>
              <GraduationCap size={12} className="inline mr-1" /> Mark 10th Batch Complete
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                <th className="p-3.5 px-4 w-10">
                  <input type="checkbox" className="cursor-pointer" checked={selected.size === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} />
                </th>
                {['Roll Number', 'Full Name', 'Email Address', 'Program Stream', 'Grade Level', 'Action'].map(h => (<th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {filteredStudents
                .map(s => (
                <tr key={s.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors ${selected.has(s.id) ? 'bg-accent-light/30 dark:bg-amber-950/10' : ''}`}>
                  <td className="p-3.5 px-4">
                    <input type="checkbox" className="cursor-pointer" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                  </td>
                  <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250">{s.rollNumber}</td>
                  <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      {s.profileImage ? <img src={s.profileImage} alt={s.name} className="w-9 h-9 rounded-full object-cover border cursor-pointer" onClick={() => setImageModalUrl(s.profileImage)} /> : <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold">{(s.name || 'S').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>}
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 px-5 text-slate-500">{s.email}</td>
                  <td className="p-3.5 px-5"><span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-accent-light text-accent border-accent/20">{s.stream}</span></td>
                  <td className="p-3.5 px-5 text-slate-500">{s.grade}</td>
                  <td className="p-3.5 px-5">
                    <div className="flex gap-3 items-center">
                      <button data-tip="View" className="p-2 rounded-lg text-sky-500 hover:text-white hover:bg-sky-500 transition-all duration-150 cursor-pointer" onClick={() => setViewingStudent(s)}><Eye size={15} /></button>
                      <button data-tip="Edit" className="p-2 rounded-lg text-amber-500 hover:text-white hover:bg-amber-500 transition-all duration-150 cursor-pointer" onClick={() => { setEditingId(s.id); setForm({ name: s.name || '', email: s.email || '', password: s.password || '', stream: s.stream || 'Secondary', grade: s.grade || 'Class 10', rollNumber: s.rollNumber || '', parentEmail: s.parentEmail || '', profileImage: s.profileImage || '' }); setShowAdd(true); }}><FileText size={15} /></button>
                      <button data-tip="Delete" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={async () => { if (await confirmAction('Delete Student?')) deleteStudent(s.id); }}><Trash size={15} /></button>
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
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{editingId ? 'Update Student' : 'Enroll New Student'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Full Name</label>
              <input type="text" className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">School Email</label>
              <input type="email" className={inputCls} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Password</label>
              <div className="flex gap-2">
                <input type="text" className={inputCls + ' flex-1'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="py-1.5 px-3 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none shrink-0" onClick={() => setForm({ ...form, password: 's-' + Math.random().toString(36).slice(2, 8) })}>Regen</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Roll Number</label>
                <input type="text" className={inputCls} required value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Grade</label>
                <select className={inputCls} value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                  <option value="Montessori">Montessori</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (<option key={n} value={`Class ${n}`}>Class {n}</option>))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Profile Photo</label>
              <input type="file" accept="image/*" className={inputCls} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (!f) return; setFile(f); try { setPreviewUrl(URL.createObjectURL(f)); } catch (err) {} }} />
              {(previewUrl || form.profileImage) && <img src={previewUrl || form.profileImage} alt="preview" className="w-20 h-20 rounded-full object-cover mt-2 border cursor-pointer" onClick={() => setImageModalUrl(previewUrl || form.profileImage)} />}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Program Stream</label>
              <select className={inputCls} value={form.stream} onChange={(e) => setForm({ ...form, stream: e.target.value })}>
                <option value="Montessori">Montessori</option>
                <option value="Pre-Primary">Pre-Primary</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" disabled={submitting} className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">{submitting ? 'Saving...' : (editingId ? 'Update Student' : 'Enroll Student')}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl('')} />

      {viewingStudent && (
        <div className={modalOverlayCls} onClick={() => setViewingStudent(null)}>
          <div className={modalFormCls} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Student Details</h3>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Name" value={viewingStudent.name} />
              <DetailRow label="Email" value={viewingStudent.email} />
              <DetailRow label="Roll Number" value={viewingStudent.rollNumber} />
              <DetailRow label="Grade" value={viewingStudent.grade} />
              <DetailRow label="Stream" value={viewingStudent.stream} />
              {viewingStudent.parentEmail && <DetailRow label="Parent Email" value={viewingStudent.parentEmail} />}
            </div>
            <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button className="py-2 px-5 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => setViewingStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showBatchModal && (
        <div className={modalOverlayCls}>
          <div className={modalFormCls}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Mark {selected.size} Student{selected.size !== 1 ? 's' : ''} as 10th Batch Complete</h3>
              <button data-tip="Close" className="text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => { setShowBatchModal(false); setBatchNameInput(''); setExistingBatch(''); }}><X size={18} /></button>
            </div>

            {existingBatchNames.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Add to Existing Batch</label>
                <select className={inputCls} value={existingBatch} onChange={(e) => { setExistingBatch(e.target.value); if (e.target.value) setBatchNameInput(''); }}>
                  <option value="">-- Select existing batch --</option>
                  {existingBatchNames.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Or Create New Batch</label>
              <input type="text" className={inputCls} placeholder="e.g. 2082" value={batchNameInput} onChange={(e) => { setBatchNameInput(e.target.value); if (e.target.value) setExistingBatch(''); }} />
            </div>

            <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button className="py-2 px-5 rounded-lg font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer outline-none disabled:opacity-40" disabled={!batchNameInput.trim() && !existingBatch} onClick={handleBatchSubmit}>
                <GraduationCap size={13} className="inline mr-1" /> Confirm Batch
              </button>
              <button className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowBatchModal(false); setBatchNameInput(''); setExistingBatch(''); }}>Cancel</button>
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

export default ManageStudents;
