import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LogIn, Eye, EyeOff, BookOpen } from 'lucide-react';

const LoginPage = () => {
  const { login, currentUser, activeRole } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) navigate(`/portal/${activeRole}`, { replace: true });
  }, [currentUser, activeRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(`/portal/${activeRole}`, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/10 px-4 py-12">
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-amber-200/50 dark:border-amber-800/30 p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-amber-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent/25 rotate-3 hover:rotate-0 transition-transform duration-500">
            <BookOpen size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Nabha Dip Academy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Sign in to your portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
              placeholder="admin@gmail.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
                placeholder="admin123"
                autoComplete="current-password"
              />
              <button data-tip={showPwd ? 'Hide password' : 'Show password'}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer outline-none transition-colors"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 backdrop-blur-sm">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-accent to-amber-600 text-white hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer outline-none shadow-lg shadow-accent/20 flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <span className="w-4.5 h-4.5 rounded-full border-2.5 border-white border-t-transparent animate-spin"></span>
            ) : (
              <><LogIn size={17} /> Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
