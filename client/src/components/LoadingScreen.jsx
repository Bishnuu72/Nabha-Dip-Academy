import { BookOpen } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/10">
      <div className="flex flex-col items-center gap-6 animate-[fadeIn_0.4s_ease-out]">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-200/50 dark:shadow-amber-900/30">
            <BookOpen size={36} className="text-white" />
          </div>
          <div className="absolute -inset-3 rounded-2xl border-2 border-amber-200/40 dark:border-amber-700/30 animate-[spin_3s_linear_infinite]" style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }} />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nabha Dip Academy
          </h1>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-[bounce_0.6s_infinite] [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-[bounce_0.6s_infinite] [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-[bounce_0.6s_infinite] [animation-delay:300ms]" />
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-600 font-medium animate-pulse mt-2">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
