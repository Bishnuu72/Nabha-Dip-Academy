import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash, Bell } from 'lucide-react';
import { inputCls, modalOverlayCls, confirmAction } from './shared';

const ManageNotices = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'academic', fileUrl: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) { updateNotice(editingId, form); } else { addNotice(form); }
    setForm({ title: '', content: '', category: 'academic', fileUrl: '' });
    setShowAdd(false); setEditingId(null);
  };

  const catColors = {
    academic: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200',
    events: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200',
    administrative: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200',
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Notice Board \u2014 All Announcements</h3>
          <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => { setEditingId(null); setForm({ title: '', content: '', category: 'academic', fileUrl: '' }); setShowAdd(true); }}><Plus size={13} /> New Notice</button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notices.length === 0 && <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">No notices published yet.</div>}
          {notices.map(notice => {
            const catCls = catColors[notice.category] || catColors.academic;
            return (
              <div key={notice.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-950/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${catCls}`}>{notice.category}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{notice.date}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{notice.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">{notice.content}</p>
                </div>
                <div className="flex flex-col gap-2 mt-1 shrink-0">
                  <button className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold" onClick={() => { setEditingId(notice.id); setForm({ title: notice.title || '', content: notice.content || '', category: notice.category || 'academic', fileUrl: notice.fileUrl || '' }); setShowAdd(true); }}><FileText size={15} /> Edit</button>
                  <button className="text-rose-400 hover:text-rose-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold" onClick={async () => { if (await confirmAction('Delete this notice permanently?')) deleteNotice(notice.id); }}><Trash size={15} /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && (
        <div className={modalOverlayCls}>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-[fadeIn_0.2s_forwards]">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><Bell size={16} className="text-accent" /> {editingId ? 'Update Notice' : 'Publish New Notice'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Notice Title</label>
              <input type="text" className={inputCls} required placeholder="e.g. Exam Schedule 2083" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Full Content</label>
              <textarea className={`${inputCls} resize-none`} rows={5} required placeholder="Write the full notice content here..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Category</label>
                <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="academic">Academic</option>
                  <option value="events">Events</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Attachment URL (optional)</label>
                <input type="url" className={inputCls} placeholder="https://..." value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">{editingId ? 'Update Notice' : 'Publish Notice'}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageNotices;
