import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash, Upload } from 'lucide-react';
import { inputCls, modalOverlayCls, modalFormCls, compressImage, confirmAction } from './shared';

const ManageGallery = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'sports', url: '', description: '' });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let payload = { ...form };
      if (file) { const url = await compressImage(file, 1200); if (url) payload.url = url; }
      if (!payload.url) { setUploading(false); return; }
      if (editingId) { await updateGalleryItem(editingId, payload); } else { await addGalleryItem(payload); }
      setForm({ title: '', category: 'sports', url: '', description: '' });
      setFile(null); setFilePreview(''); setUploadProgress(0); setShowAdd(false); setEditingId(null);
    } catch (err) { console.error('Gallery submit failed:', err); }
    setUploading(false);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Public Gallery Directory</h3>
          <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => { setEditingId(null); setForm({ title: '', category: 'sports', url: '', description: '' }); setShowAdd(true); }}><Plus size={13} /> Add Image</button>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map(item => (
            <div key={item.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950/40 hover:shadow-md transition-shadow">
              <img src={item.url} alt={item.title} className="w-full h-36 object-cover" />
              <div className="p-3">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-accent-light text-accent border-accent/20">{item.category}</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">{item.title}</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold" onClick={() => { setEditingId(item.id); setForm({ title: item.title || '', category: item.category || 'sports', url: item.url || '', description: item.description || '' }); setShowAdd(true); }}><FileText size={13} /> Edit</button>
                  <button className="text-rose-500 hover:text-rose-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold" onClick={async () => { if (await confirmAction('Delete Photo?')) deleteGalleryItem(item.id); }}><Trash size={13} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className={modalOverlayCls}>
          <form onSubmit={handleSubmit} className={`${modalFormCls} max-w-lg`}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{editingId ? 'Update Gallery Photo' : 'Add Gallery Photo'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Photo Title</label>
              <input type="text" className={inputCls} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Volleyball Champions" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">Upload Photo from Device</label>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 cursor-pointer hover:border-accent transition-colors bg-slate-50 dark:bg-slate-950/40">
                {filePreview ? <img src={filePreview} alt="Preview" className="w-full max-h-40 object-cover rounded-lg mb-1" /> : <><Upload size={24} className="text-slate-400" /><span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click to choose an image file</span><span className="text-[10px] text-slate-400">JPG, PNG, WEBP supported</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); setFilePreview(URL.createObjectURL(f)); setForm(prev => ({ ...prev, url: '' })); } }} />
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Or Paste Image URL</label>
              <input type="url" className={inputCls} value={form.url} onChange={(e) => { setForm({ ...form, url: e.target.value }); if (e.target.value) { setFile(null); setFilePreview(''); } }} placeholder="https://images.unsplash.com/..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Category</label>
                <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="sports">Sports Events</option>
                  <option value="annual">Annual Functions</option>
                  <option value="campus">Campus Premises</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Description</label>
                <input type="text" className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief photo caption..." />
              </div>
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" disabled={uploading} className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none disabled:opacity-60">{uploading ? 'Uploading...' : (editingId ? 'Update Photo' : 'Save to Gallery')}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); setFile(null); setFilePreview(''); setUploadProgress(0); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
