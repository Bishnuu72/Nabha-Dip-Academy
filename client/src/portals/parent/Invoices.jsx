import React, { useContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { CreditCard, CheckCircle } from 'lucide-react';

const invStatus = (inv) => {
  const paid = Number(inv.paidAmount || 0);
  const total = Number(inv.amount || 0);
  if (paid >= total && total > 0) return 'paid';
  if (paid > 0) return 'partial';
  return 'unpaid';
};

const Invoices = () => {
  const { invoices, updateInvoice } = useContext(AppContext);
  const { childInfo } = useOutletContext();
  const childRoll = childInfo?.rollNumber;

  const [showPayModal, setShowPayModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const childInvoices = invoices.filter(inv => inv.studentRoll === childRoll);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const openPayModal = (inv) => {
    const total = Number(inv.amount || 0);
    const paid = Number(inv.paidAmount || 0);
    setPayingInvoice(inv);
    setPayAmount(String(total - paid));
    setShowPayModal(true);
  };

  const handlePayInvoice = (e) => {
    e.preventDefault();
    if (!payingInvoice || !payAmount || Number(payAmount) <= 0) return;
    const total = Number(payingInvoice.amount || 0);
    const currentPaid = Number(payingInvoice.paidAmount || 0);
    const newPaid = currentPaid + Number(payAmount);
    const finalPaid = Math.min(newPaid, total);
    const payload = { paidAmount: finalPaid };
    if (finalPaid >= total) {
      payload.status = 'paid';
      payload.paidAt = new Date().toISOString();
    }
    updateInvoice(payingInvoice.id, payload);
    setShowPayModal(false);
    setPayingInvoice(null);
    triggerToast('Payment processed successfully via eSewa simulator!');
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80">
          <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Quarterly Fee Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60">
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Invoice ID</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Term Description</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Total Fee</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Paid</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Due Amount</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Due Date</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
              {childInvoices.map(inv => {
                const paid = Number(inv.paidAmount || 0);
                const total = Number(inv.amount || 0);
                const due = total - paid;
                const status = invStatus(inv);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                    <td className="p-3.5 px-5 font-bold text-slate-800 dark:text-slate-250 whitespace-nowrap">#{inv.id?.slice(-6).toUpperCase()}</td>
                    <td className="p-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300">{inv.term}</td>
                    <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-white whitespace-nowrap">Rs. {total.toLocaleString()}</td>
                    <td className="p-3.5 px-5 text-emerald-600 dark:text-emerald-450 font-semibold whitespace-nowrap">{paid > 0 ? `Rs. ${paid.toLocaleString()}` : '--'}</td>
                    <td className="p-3.5 px-5 font-bold text-rose-500 whitespace-nowrap">{due > 0 ? `Rs. ${due.toLocaleString()}` : '--'}</td>
                    <td className="p-3.5 px-5 text-slate-500 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="p-3.5 px-5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        status === 'paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-55'
                          : status === 'partial'
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 border-amber-55'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border-rose-55'
                      }`}>{status}</span>
                    </td>
                    <td className="p-3.5 px-5">
                      {status !== 'paid' ? (
                        <button
                          className="py-1 px-3 rounded font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors outline-none cursor-pointer"
                          onClick={() => openPayModal(inv)}
                        >
                          {status === 'partial' ? 'Pay Remaining' : 'Pay via eSewa'}
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-600 dark:text-emerald-450 font-bold">Receipt Cleared ✔</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {childInvoices.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">No invoices found for this child.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPayModal && payingInvoice && (
        <div className="fixed inset-0 w-full h-full bg-slate-950/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handlePayInvoice}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl w-full max-w-sm relative shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-[fadeIn_0.2s_forwards]"
          >
            <div className="text-center mb-2">
              <div className="text-accent inline-flex mb-2">
                <CreditCard size={40} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">eSewa Gateway Payment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{payingInvoice.term}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Fee: <strong className="text-slate-800 dark:text-white">Rs. {Number(payingInvoice.amount).toLocaleString()}</strong></p>
              {Number(payingInvoice.paidAmount || 0) > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">Already Paid: <strong className="text-emerald-600">Rs. {Number(payingInvoice.paidAmount).toLocaleString()}</strong></p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Amount to Pay (Rs.)</label>
              <input
                type="number"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                min="1"
                max={Number(payingInvoice.amount || 0) - Number(payingInvoice.paidAmount || 0)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">eSewa ID / Phone Number</label>
              <input
                type="tel"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                placeholder="98********"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Secure MPIN (4-digit)</label>
              <input
                type="password"
                maxLength="4"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent"
                placeholder="****"
                required
              />
            </div>
            <div className="flex gap-3 mt-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button type="submit" className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white cursor-pointer transition-colors outline-none">
                Pay Rs. {Number(payAmount || 0).toLocaleString()}
              </button>
              <button
                type="button"
                className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-250 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer outline-none"
                onClick={() => { setShowPayModal(false); setPayingInvoice(null); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Invoices;
