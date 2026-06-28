import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, FileText, Trash, CreditCard, Users } from 'lucide-react';
import { inputCls, modalOverlayCls, modalFormCls, confirmAction } from './shared';

const ALL_GRADES = ['Montessori', 'Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];

const emptyForm = { studentRoll: '', studentName: '', grade: '', term: '', amount: '', paidAmount: '', dueDate: '' };

const invStatus = (inv) => {
  const paid = Number(inv.paidAmount || 0);
  const total = Number(inv.amount || 0);
  if (paid >= total && total > 0) return 'paid';
  if (paid > 0) return 'partial';
  return 'unpaid';
};

const statusBadge = (inv) => {
  const s = invStatus(inv);
  const cls = s === 'paid'
    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55'
    : s === 'partial'
    ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-55'
    : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-55';
  return <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${cls}`}>{s}</span>;
};

const ManageInvoices = () => {
  const { invoices, students, addInvoice, updateInvoice, deleteInvoice, addInvoicesBulk } = useContext(AppContext);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkGrade, setBulkGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('All');

  const activeStudents = students.filter(s => !s.deleted && !s.batchCompleted);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bulkMode) {
      if (!bulkGrade || !form.term || !form.amount || !form.dueDate) return;
      const classStudents = activeStudents.filter(s => s.grade === bulkGrade);
      if (classStudents.length === 0) return;
      const invoiceList = classStudents.map(s => ({
        studentRoll: s.rollNumber,
        studentName: s.name,
        grade: s.grade,
        term: form.term,
        amount: Number(form.amount),
        dueDate: form.dueDate
      }));
      addInvoicesBulk(invoiceList);
      setForm({ ...emptyForm });
      setBulkGrade('');
      setShowAdd(false);
      return;
    }
    if (!form.studentRoll || !form.term || !form.amount || !form.dueDate) return;
    const payload = {
      studentRoll: form.studentRoll,
      studentName: form.studentName,
      grade: form.grade,
      term: form.term,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      status: 'unpaid',
      paidAmount: Number(form.paidAmount || 0)
    };
    if (editingId) {
      updateInvoice(editingId, payload);
    } else {
      addInvoice(payload);
    }
    setForm({ ...emptyForm });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleStudentSelect = (roll) => {
    const s = activeStudents.find(st => st.rollNumber === roll);
    setForm({ ...form, studentRoll: roll, studentName: s?.name || '', grade: s?.grade || '' });
  };

  const grades = [...new Set(activeStudents.map(s => s.grade).filter(Boolean))].sort();

  const filtered = invoices.filter(inv => {
    const s = invStatus(inv);
    if (filterStatus === 'paid' && s !== 'paid') return false;
    if (filterStatus === 'unpaid' && s !== 'unpaid') return false;
    if (filterStatus === 'partial' && s !== 'partial') return false;
    if (filterGrade !== 'All' && inv.grade !== filterGrade) return false;
    return true;
  });

  const openAddSingle = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setBulkMode(false);
    setBulkGrade('');
    setShowAdd(true);
  };

  const openAddBulk = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setBulkMode(true);
    setBulkGrade('');
    setShowAdd(true);
  };

  const bulkStudentCount = bulkGrade ? activeStudents.filter(s => s.grade === bulkGrade).length : 0;

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Fee Invoices Manager</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <select className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-accent" value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
              <option value="All">All Grades</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-accent" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
            <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={openAddSingle}><Plus size={13} /> Add Single</button>
            <button className="py-1.5 px-4 rounded-lg font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 transition-colors outline-none cursor-pointer flex items-center gap-1.5" onClick={openAddBulk}><Users size={13} /> Add for Class</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                {['Invoice ID', 'Student', 'Grade', 'Term', 'Total Fee', 'Paid', 'Due', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {filtered.map(inv => {
                const paid = Number(inv.paidAmount || 0);
                const total = Number(inv.amount || 0);
                const due = total - paid;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250 whitespace-nowrap">#{inv.id?.slice(-6).toUpperCase()}</td>
                    <td className="p-3.5 px-5">
                      <div className="font-semibold text-slate-900 dark:text-white">{inv.studentName || '--'}</div>
                      <div className="text-[10px] text-slate-400">Roll: {inv.studentRoll}</div>
                    </td>
                    <td className="p-3.5 px-5 text-slate-500">{inv.grade || '--'}</td>
                    <td className="p-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate" title={inv.term}>{inv.term}</td>
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white whitespace-nowrap">Rs. {total.toLocaleString()}</td>
                    <td className="p-3.5 px-5 text-emerald-600 dark:text-emerald-450 font-semibold whitespace-nowrap">{paid > 0 ? `Rs. ${paid.toLocaleString()}` : '--'}</td>
                    <td className="p-3.5 px-5 font-bold text-rose-500 whitespace-nowrap">{due > 0 ? `Rs. ${due.toLocaleString()}` : '--'}</td>
                    <td className="p-3.5 px-5 text-slate-500 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="p-3.5 px-5">{statusBadge(inv)}</td>
                    <td className="p-3.5 px-5">
                      <div className="flex gap-3 items-center">
                        <button data-tip="Edit" className="p-2 rounded-lg text-amber-500 hover:text-white hover:bg-amber-500 transition-all duration-150 cursor-pointer" onClick={() => { setEditingId(inv.id); setBulkMode(false); setForm({ studentRoll: inv.studentRoll || '', studentName: inv.studentName || '', grade: inv.grade || '', term: inv.term || '', amount: inv.amount || '', paidAmount: inv.paidAmount || '', dueDate: inv.dueDate || '' }); setShowAdd(true); }}><FileText size={15} /></button>
                        {invStatus(inv) !== 'paid' && (
                          <button data-tip="Mark Fully Paid" className="p-2 rounded-lg text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all duration-150 cursor-pointer" onClick={() => updateInvoice(inv.id, { paidAmount: Number(inv.amount || 0), status: 'paid', paidAt: new Date().toISOString() })}><CreditCard size={15} /></button>
                        )}
                        <button data-tip="Delete" className="p-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500 transition-all duration-150 cursor-pointer" onClick={async () => { if (await confirmAction('Delete this invoice?')) deleteInvoice(inv.id); }}><Trash size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="p-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className={modalOverlayCls}>
          <form onSubmit={handleSubmit} className={modalFormCls + ' max-w-lg'}>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {editingId ? 'Edit Invoice' : bulkMode ? 'Create Invoices for Whole Class' : 'Create New Invoice'}
            </h3>

            {bulkMode ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Select Class</label>
                <select className={inputCls} required value={bulkGrade} onChange={(e) => setBulkGrade(e.target.value)}>
                  <option value="">-- Select Class --</option>
                  {ALL_GRADES.map(g => (
                    <option key={g} value={g}>{g} ({activeStudents.filter(s => s.grade === g).length} students)</option>
                  ))}
                </select>
                {bulkGrade && (
                  <p className="text-[10px] text-accent font-semibold mt-1">This will create invoices for {bulkStudentCount} student(s) in {bulkGrade}.</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Student</label>
                {editingId ? (
                  <input type="text" className={inputCls} value={`${form.studentName} (${form.studentRoll})`} disabled />
                ) : (
                  <select className={inputCls} required value={form.studentRoll} onChange={(e) => handleStudentSelect(e.target.value)}>
                    <option value="">-- Select Student --</option>
                    {activeStudents.map(s => (
                      <option key={s.id} value={s.rollNumber}>{s.name} (Roll: {s.rollNumber} | {s.grade})</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Term Description</label>
              <input type="text" className={inputCls} required value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="e.g. First Term Exam Fee & Tuition" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Total Fee (Rs.)</label>
                <input type="number" className={inputCls} required min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="18500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Due Date</label>
                <input type="date" className={inputCls} required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
            {editingId && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Amount Paid So Far (Rs.)</label>
                <input type="number" className={inputCls} min="0" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} placeholder="0" />
              </div>
            )}
            <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none">
                {editingId ? 'Update Invoice' : bulkMode ? `Create ${bulkStudentCount} Invoice(s)` : 'Create Invoice'}
              </button>
              <button type="button" className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 transition-colors cursor-pointer outline-none" onClick={() => { setShowAdd(false); setEditingId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageInvoices;
