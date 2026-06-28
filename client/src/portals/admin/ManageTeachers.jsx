import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash, Eye } from 'lucide-react';
import { inputCls, modalOverlayCls, modalFormCls, compressImage, confirmAction } from './shared';
import { ImageModal } from './SharedComponents';

const STREAMS = ['Montessori', 'Pre-Primary', 'Primary', 'Secondary', 'All Streams'];

const ManageTeachers = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', streams: [], phone: '', profileImage: '' });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageModalUrl, setImageModalUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  const toggleStream = (s) => {
    setForm(prev => ({
      ...prev,
      streams: prev.streams.includes(s)
        ? prev.streams.filter(x => x !== s)
        : [...prev.streams, s]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let payload = { ...form, streams: form.streams };
      if (file) { const url = await compressImage(file, 400); if (url) payload.profileImage = url; }
      if (editingId) { await updateTeacher(editingId, payload); } else { await addTeacher(payload); }
      setForm({ name: '', email: '', password: '', streams: [], phone: '', profileImage: '' });
      setFile(null); setPreviewUrl(''); setShowAdd(false); setEditingId(null);
    } catch (err) { console.error('Teacher submit failed:', err); }
    setSubmitting(false);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Active Teacher Roster</h3>
          <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => { setEditingId(null); setForm({ name: '', email: '', password: 't-' + Math.random().toString(36).slice(2, 8), streams: [], phone: '', profileImage: '' }); setShowAdd(true); }}><Plus size={13} /> Add Instructor</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                {['Full Name', 'Email', 'Stream', 'Phone', 'Action'].map(h => (<th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">{h}</th>))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {teachers.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                  <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      {t.profileImage ? <img src={t.profileImage} alt={t.name} className="w-9 h-9 rounded-full object-cover border cursor-pointer" onClick={() => setImageModalUrl(t.profileImage)} /> : <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold">{(t.name || 'T').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>}
                      <span>{t.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 px-5 text-slate-500">{t.email}</td>
                  <td className="p-3.5 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(t.streams) ? t.streams : [t.stream || t.department]).filter(Boolean).map((s, i) => (
                        <span key={i} className="text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-gradient-to-r from-accent/15 to-accent/5 text-accent border border-accent/20 shadow-sm">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 px-5 text-slate-500">{t.phone}</td>
                  <td className="p-3.5 px-5">
                    <div className="flex gap-3 items-center">
                      <button data-tip="View" className="p-2 rounded-lg text-sky-500 hover:text-white hover:bg-sky-500 transition-all duration-150 cursor-pointer" onClick={() => setViewingTeacher(t)}><Eye size={15} /></button>
                      <button data-tip="Edit" className="p-2 rounded-lg text-amber-500 hover:text-white hover:bg-amber-500 transition-all duration-150 cursor-pointer" onClick={() => { setEditingId(t.id); setForm({ name: t.name || '', email: t.email || '', password: t.password || '', streams: Array.isArray(t.streams) ? [...t.streams] : (t.stream || t.department ? [t.stream || t.department] : []), phone: t.phone || '', profileImage: t.profileImage || '' }); setShowAdd(true); }}><FileText size={15} /></button>
                      <button data-tip="Delete" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={async () => { if (await confirmAction('Delete Teacher?')) deleteTeacher(t.id); }}><Trash size={15} /></button>
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
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{editingId ? 'Update Instructor' : 'Enroll Instructor'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Full Name</label>
              <input type="text" className={inputCls} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Email</label>
              <input type="email" className={inputCls} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Password</label>
              <div className="flex gap-2">
                <input type="text" className={inputCls + ' flex-1'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="py-1.5 px-3 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none shrink-0" onClick={() => setForm({ ...form, password: 't-' + Math.random().toString(36).slice(2, 8) })}>Regen</button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Assigned Streams</label>
                {form.streams.length > 0 && (
                  <span className="text-[9px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{form.streams.length} selected</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STREAMS.map(s => {
                  const checked = form.streams.includes(s);
                  return (
                    <label key={s} onClick={() => toggleStream(s)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-[11px] font-semibold transition-all duration-150 border outline-none select-none ${
                        checked
                          ? 'bg-accent text-white border-accent shadow-sm'
                          : 'bg-white dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-accent/30 hover:text-accent'
                      }`}>
                      <div className={`w-3.5 h-3.5 rounded-[3px] flex items-center justify-center transition-colors shrink-0 ${
                        checked
                          ? 'bg-white/25'
                          : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600'
                      }`}>
                        {checked && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </div>
                      {s}
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Phone</label>
                <input type="tel" className={inputCls} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Profile Photo</label>
              <input type="file" accept="image/*" className={inputCls} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (!f) return; setFile(f); try { setPreviewUrl(URL.createObjectURL(f)); } catch (err) {} }} />
              {(previewUrl || form.profileImage) && <img src={previewUrl || form.profileImage} alt="preview" className="w-20 h-20 rounded-full object-cover mt-2 border cursor-pointer" onClick={() => setImageModalUrl(previewUrl || form.profileImage)} />}
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" disabled={submitting} className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">{submitting ? 'Saving...' : (editingId ? 'Update Instructor' : 'Enroll Teacher')}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <ImageModal url={imageModalUrl} onClose={() => setImageModalUrl('')} />

      {viewingTeacher && (
        <div className={modalOverlayCls} onClick={() => setViewingTeacher(null)}>
          <div className={modalFormCls} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Teacher Details</h3>
            <div className="space-y-2.5 text-sm">
              <DetailRow label="Name" value={viewingTeacher.name} />
              <DetailRow label="Email" value={viewingTeacher.email} />
              <DetailRow label="Phone" value={viewingTeacher.phone || '\u2014'} />
              <DetailRow label="Streams" value={Array.isArray(viewingTeacher.streams) ? viewingTeacher.streams.join(', ') : (viewingTeacher.stream || viewingTeacher.department || '\u2014')} />
            </div>
            <div className="flex justify-end mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button className="py-2 px-5 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => setViewingTeacher(null)}>Close</button>
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

export default ManageTeachers;
