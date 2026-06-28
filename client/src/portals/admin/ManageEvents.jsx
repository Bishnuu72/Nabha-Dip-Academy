import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash, Calendar, Clock, MapPin } from 'lucide-react';
import { inputCls, modalOverlayCls, confirmAction } from './shared';

const ManageEvents = () => {
  const { events, createEvent, updateEvent, deleteEvent } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', maxSeats: 100, image: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, maxSeats: Number(form.maxSeats) || 100 };
    if (editingId) { updateEvent(editingId, payload); } else { createEvent(payload); }
    setForm({ title: '', description: '', date: '', time: '', location: '', maxSeats: 100, image: '' });
    setShowAdd(false); setEditingId(null);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-3 flex-wrap">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Upcoming Events \u2014 All Listings</h3>
          <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={() => { setEditingId(null); setForm({ title: '', description: '', date: '', time: '', location: '', maxSeats: 100, image: '' }); setShowAdd(true); }}><Plus size={13} /> New Event</button>
        </div>
        {events.length === 0 && <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">No events listed yet.</div>}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {events.map(event => (
            <div key={event.id} className="flex items-start gap-4 p-5 hover:bg-slate-50/60 dark:hover:bg-slate-950/30 transition-colors">
              <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {event.image ? <img src={event.image} alt={event.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600"><Calendar size={24} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">{event.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">{event.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={10} className="text-accent" /> {event.date}</span>
                  {event.time && <span className="flex items-center gap-1"><Clock size={10} className="text-accent" /> {event.time}</span>}
                  {event.location && <span className="flex items-center gap-1"><MapPin size={10} className="text-accent" /> {event.location}</span>}
                  <span className="bg-accent-light text-accent px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">{event.registeredCount || 0} / {event.maxSeats || '\u221e'} Registered</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-1 shrink-0">
                <button className="text-amber-500 hover:text-amber-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold" onClick={() => { setEditingId(event.id); setForm({ title: event.title || '', description: event.description || '', date: event.date || '', time: event.time || '', location: event.location || '', maxSeats: event.maxSeats || 100, image: event.image || '' }); setShowAdd(true); }}><FileText size={15} /> Edit</button>
                <button className="text-rose-400 hover:text-rose-600 transition-colors cursor-pointer text-xs flex items-center gap-1 font-bold" onClick={async () => { if (await confirmAction('Delete this event permanently?')) deleteEvent(event.id); }}><Trash size={15} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className={modalOverlayCls}>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-[fadeIn_0.2s_forwards] max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2"><Calendar size={16} className="text-accent" /> {editingId ? 'Update Event' : 'Create New Event'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Event Title</label>
              <input type="text" className={inputCls} required placeholder="e.g. Annual Science Fair" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Description</label>
              <textarea className={`${inputCls} resize-none`} rows={3} required placeholder="Brief event description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Date</label>
                <input type="date" className={inputCls} required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Time</label>
                <input type="text" className={inputCls} placeholder="e.g. 10:00 AM - 1:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Venue / Location</label>
                <input type="text" className={inputCls} required placeholder="e.g. NDA Auditorium" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Max Seats</label>
                <input type="number" className={inputCls} min={1} placeholder="100" value={form.maxSeats} onChange={(e) => setForm({ ...form, maxSeats: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Cover Image URL (optional)</label>
              <input type="url" className={inputCls} placeholder="https://images.unsplash.com/..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="flex gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">{editingId ? 'Update Event' : 'Create Event'}</button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
