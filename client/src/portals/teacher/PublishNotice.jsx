import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Send, CheckCircle } from 'lucide-react';

const PublishNotice = () => {
  const { addNotice } = useContext(AppContext);

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'academic',
    content: ''
  });
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handlePublishNotice = (e) => {
    e.preventDefault();
    addNotice({
      title: newNotice.title,
      category: newNotice.category,
      content: newNotice.content
    });
    triggerToast('Global announcement board updated!');
    setNewNotice({
      title: '',
      category: 'academic',
      content: ''
    });
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] max-w-2xl mx-auto">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-805 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">
          Publish Board Announcement
        </h3>
        <form onSubmit={handlePublishNotice} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Notice Headline</label>
            <input 
              type="text" 
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-905 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
              value={newNotice.title} 
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} 
              placeholder="e.g. Science Board Practical Postponement" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Information Category</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
              value={newNotice.category}
              onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
            >
              <option value="academic">Academic Board</option>
              <option value="administrative">Administrative Board</option>
              <option value="events">Activity & Events Board</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Detailed Statement</label>
            <textarea 
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent resize-y" 
              value={newNotice.content} 
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })} 
              placeholder="Write detailed school announcement statement..." 
              rows="6" 
              required 
            ></textarea>
          </div>

          <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors mt-2 outline-none">
            <Send size={14} /> Dispatch Announcement
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublishNotice;
