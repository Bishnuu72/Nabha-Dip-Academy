import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Megaphone, Plus, Edit3, Trash, Calendar, ExternalLink, XCircle, PlusCircle, CheckCircle } from 'lucide-react';
import { confirmAction } from './shared';

const typeColor = (type) => {
  const colors = {
    general: 'bg-gray-100 text-gray-700 dark:bg-gray-200/20 dark:text-gray-300',
    achievement: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-300',
    notice: 'bg-blue-100 text-blue-800 dark:bg-blue-200/20 dark:text-blue-300',
    event: 'bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-300'
  };
  return colors[type] || colors.general;
};

const Announcements = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', content: '', type: 'general', linkUrl: '' });

  const filtered = announcements.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()) || a.content?.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (editingId) { updateAnnouncement(editingId, payload); } else { addAnnouncement(payload); }
    setForm({ title: '', content: '', type: 'general', linkUrl: '' });
    setShowAdd(false); setEditingId(null);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-cyan-500" /> Manage Announcements
        </h2>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-white dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white/80 placeholder-gray-400 dark:placeholder-gray-500 text-sm w-56 outline-none focus:border-cyan-500/50" />
          <button onClick={() => { setShowAdd(true); setEditingId(null); setForm({ title: '', content: '', type: 'general', linkUrl: '' }); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg text-sm">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 flex items-center gap-2">
              {editingId ? <Edit3 className="w-5 h-5 text-cyan-500" /> : <PlusCircle className="w-5 h-5 text-cyan-500" />}
              {editingId ? 'Edit Announcement' : 'New Announcement'}
            </h3>
            <button type="button" data-tip="Close" onClick={() => { setShowAdd(false); setEditingId(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white"><XCircle className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title" className="w-full bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-cyan-500/50" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Content *</label>
              <textarea required rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Announcement details" className="w-full bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-cyan-500/50 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-cyan-500/50">
                <option value="general">General</option>
                <option value="achievement">Achievement</option>
                <option value="notice">Notice</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Link URL (optional)</label>
              <input type="url" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://"
                className="w-full bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-cyan-500/50" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); }}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-sm font-medium">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg">
              {editingId ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg text-gray-500 dark:text-gray-400">No announcements yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Click "New Announcement" to publish one.</p>
          </div>
        ) : filtered.map((item) => (
          <div key={item.id} className="group bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/40 rounded-xl p-5 hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor(item.type)}`}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                  {item.date && <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{item.date}</span>}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 whitespace-pre-wrap">{item.content}</p>
                {item.linkUrl && <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mt-2 inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Learn More</a>}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button data-tip="Edit" onClick={() => { setEditingId(item.id); setForm({ title: item.title, content: item.content, type: item.type, linkUrl: item.linkUrl || '' }); setShowAdd(true); }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-cyan-100 dark:hover:bg-cyan-600/30 text-gray-500 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-300"><Edit3 className="w-4 h-4" /></button>
                <button data-tip="Delete" onClick={async () => { if (await confirmAction('Delete this announcement?')) deleteAnnouncement(item.id); }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-red-100 dark:hover:bg-red-600/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><Trash className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
