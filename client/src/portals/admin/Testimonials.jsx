import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { MessageCircle, Plus, Trash, Users, User, CheckCircle, PlusCircle, XCircle, Edit3 } from 'lucide-react';
import { confirmAction } from './shared';

const Testimonials = () => {
  const { testimonials, students, teachers, addTestimonial, updateTestimonial, deleteTestimonial } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ personType: 'student', personId: '', content: '', rating: 5 });
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handlePersonSelect = (type, id) => {
    setForm({ ...form, personType: type, personId: id });
    const person = type === 'student' ? students.find(s => s.id === id) : teachers.find(t => t.id === id);
    setSelectedPerson(person || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.personId || !form.content.trim()) return;
    const person = form.personType === 'student' ? students.find(s => s.id === form.personId) : teachers.find(t => t.id === form.personId);
    if (!person) return;
    const data = {
      personType: form.personType, personId: form.personId, personName: person.name,
      personRole: form.personType === 'student' ? `Student - ${person.grade || person.stream || ''}` : `Teacher - ${Array.isArray(person.streams) ? person.streams.join(', ') : person.stream || person.department || ''}`,
      personPhoto: person.profileImage || '', content: form.content.trim(), rating: form.rating
    };
    if (editingId) {
      updateTestimonial(editingId, data);
    } else {
      addTestimonial(data);
    }
    setShowAdd(false); setEditingId(null); setForm({ personType: 'student', personId: '', content: '', rating: 5 }); setSelectedPerson(null);
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards] flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-emerald-500" /> Manage Testimonials
        </h2>
        <button onClick={() => { setShowAdd(true); setEditingId(null); setForm({ personType: 'student', personId: '', content: '', rating: 5 }); setSelectedPerson(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg text-sm">
          <Plus className="w-4 h-4" /> New Testimonial
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 flex items-center gap-2">{editingId ? <Edit3 className="w-5 h-5 text-emerald-500" /> : <PlusCircle className="w-5 h-5 text-emerald-500" />}{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button type="button" data-tip="Close" onClick={() => { setShowAdd(false); setEditingId(null); setSelectedPerson(null); }} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white"><XCircle className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => { setForm({ ...form, personType: 'student', personId: '' }); setSelectedPerson(null); }}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                form.personType === 'student'
                  ? 'bg-emerald-100 dark:bg-emerald-600/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:border-gray-600'
              }`}>
              <Users className="w-4 h-4 mx-auto mb-1" /> From Students
            </button>
            <button type="button" onClick={() => { setForm({ ...form, personType: 'teacher', personId: '' }); setSelectedPerson(null); }}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-colors ${
                form.personType === 'teacher'
                  ? 'bg-emerald-100 dark:bg-emerald-600/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:border-gray-600'
              }`}>
              <User className="w-4 h-4 mx-auto mb-1" /> From Teachers
            </button>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Select {form.personType === 'student' ? 'Student' : 'Teacher'}</label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {(form.personType === 'student' ? students : teachers).map(p => (
                <div key={p.id} onClick={() => handlePersonSelect(form.personType, p.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${
                    form.personId === p.id
                      ? 'bg-emerald-50 dark:bg-emerald-600/15 border-emerald-400 dark:border-emerald-500/40'
                      : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                  {p.profileImage ? <img src={p.profileImage} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600 shrink-0" /> :
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-600/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                      {(p.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{form.personType === 'student' ? `${p.grade || p.stream || 'Student'} \u2022 ${p.email || ''}` : `${Array.isArray(p.streams) ? p.streams.join(', ') : p.stream || p.department || 'Teacher'} \u2022 ${p.email || ''}`}</p>
                  </div>
                  {form.personId === p.id && <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
          {selectedPerson && (
            <div className="bg-emerald-50 dark:bg-gray-900/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-4">
              {selectedPerson.profileImage ? <img src={selectedPerson.profileImage} alt={selectedPerson.name} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-300 dark:border-emerald-500/30 shrink-0" /> :
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-600/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-lg shrink-0 border-2 border-emerald-300 dark:border-emerald-500/30">
                  {(selectedPerson.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>}
              <div><p className="text-base font-bold text-gray-900 dark:text-white">{selectedPerson.name}</p><p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{form.personType === 'student' ? 'Student' : 'Teacher'}</p></div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Testimonial Content *</label>
            <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="What they said about Nabha Dip Academy..." className="w-full bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-emerald-500/50 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                  className={`text-2xl ${star <= form.rating ? 'text-yellow-400 scale-110' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400'}`}>{'\u2605'}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); setSelectedPerson(null); }}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-sm font-medium">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg">{editingId ? 'Update Testimonial' : 'Publish Testimonial'}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg text-gray-500 dark:text-gray-400">No testimonials yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Click "New Testimonial" to add one.</p>
          </div>
        ) : testimonials.map((item) => (
          <div key={item.id} className="group bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/40 rounded-xl p-5 hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all shadow-sm">
            <div className="flex items-start gap-4">
              {item.personPhoto ? <img src={item.personPhoto} alt={item.personName} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200 dark:border-emerald-500/20 shrink-0" /> :
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-600/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold shrink-0 border-2 border-emerald-200 dark:border-emerald-500/20">
                  {(item.personName || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-0.5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.personName}</h3>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 shrink-0">{item.personType}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{item.personRole}</p>
                {item.rating && <div className="flex gap-0.5 mb-2">{[1, 2, 3, 4, 5].map(star => <span key={star} className={`text-sm ${star <= item.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>{'\u2605'}</span>)}</div>}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{'\u201C'}{item.content}{'\u201D'}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 shrink-0">
                <button data-tip="Edit" onClick={() => {
                  const person = (item.personType === 'student' ? students : teachers).find(p => p.id === item.personId);
                  setEditingId(item.id);
                  setForm({ personType: item.personType, personId: item.personId, content: item.content, rating: item.rating || 5 });
                  setSelectedPerson(person || null);
                  setShowAdd(true);
                }} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-cyan-100 dark:hover:bg-cyan-600/30 text-gray-500 dark:text-gray-400 hover:text-cyan-700 dark:hover:text-cyan-300"><Edit3 className="w-4 h-4" /></button>
                <button data-tip="Delete" onClick={async () => { if (await confirmAction('Delete this testimonial?')) deleteTestimonial(item.id); }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-red-100 dark:hover:bg-red-600/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><Trash className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
