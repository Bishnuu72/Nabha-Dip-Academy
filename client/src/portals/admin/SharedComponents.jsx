import { CheckCircle } from 'lucide-react';
import { modalOverlayCls } from './shared';

export const Toast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
      <CheckCircle size={18} />
      <span>{message}</span>
    </div>
  );
};

export const ImageModal = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <div className={modalOverlayCls} onClick={onClose}>
      <div className="bg-transparent p-4 max-w-4xl w-full">
        <img src={url} alt="preview" className="w-full h-auto rounded-lg shadow-2xl object-contain" />
      </div>
    </div>
  );
};
