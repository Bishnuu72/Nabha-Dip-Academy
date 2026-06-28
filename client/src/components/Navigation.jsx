import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LogOut, LayoutDashboard, ArrowRight, Sun, Moon } from 'lucide-react';

const Navigation = () => {
  const { activeRole, logout, currentUser, schoolConfig } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ndases-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const menuItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About Us', path: '/about' },
    { id: 'academics', label: 'Academics', path: '/academics' },
    { id: 'admissions', label: 'Admissions', path: '/admissions' },
    { id: 'gallery', label: 'Gallery', path: '/gallery' },
    { id: 'contact', label: 'Contact Us', path: '/contact' }
  ];

  const isPortal = location.pathname.startsWith('/portal');
  const currentPath = location.pathname;

  const handleLogout = async () => {
    if (logout) await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 left-0 w-full z-40 border-b border-slate-200 dark:border-slate-800 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setMobileMenuOpen(false)}>
          {schoolConfig?.schoolLogo ? (
            <img src={schoolConfig.schoolLogo} alt="NDA Logo" className="w-11 h-11 object-contain rounded-lg shadow-xs border border-slate-200 dark:border-slate-800 bg-white" />
          ) : (
            <div className="w-11 h-11 rounded-lg bg-accent text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
              NDA
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
               <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
                Nabha Dip Academy
              </h1>
            </div>
            <span className="text-[9px] text-accent uppercase tracking-wider font-bold block mt-0.5">
              Secondary English School
            </span>
          </div>
        </Link>

        {/* Mobile Hamburger menu toggle button */}
        <button 
          className="md:hidden flex flex-col justify-between w-6 h-4.5 cursor-pointer z-50 outline-none" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`block h-[2.5px] w-full bg-slate-950 dark:bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}></span>
          <span className={`block h-[2.5px] w-full bg-slate-950 dark:bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-[2.5px] w-full bg-slate-950 dark:bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}></span>
        </button>

        {/* Navigation links & actions */}
        <ul className={`
          flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-7 list-none
          fixed md:relative top-0 ${mobileMenuOpen ? 'right-0' : '-right-full'} md:right-0 
          w-[280px] md:w-auto h-screen md:h-auto bg-white dark:bg-slate-950 md:bg-transparent dark:md:bg-transparent 
          shadow-2xl md:shadow-none p-10 md:p-0 transition-all duration-300 
          border-l border-slate-200 dark:border-slate-800 md:border-l-0 z-40
        `}>
          <div className="md:hidden pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 w-full">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Menu</h3>
          </div>
          
          {menuItems.map((item) => (
            <li key={item.id} className="relative w-full md:w-auto">
              <Link
                to={item.path}
                className={`
                  text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-accent 
                  py-1 flex items-center gap-1 w-full text-left transition-colors relative 
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                  after:bg-accent after:transition-all after:duration-300
                  ${currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)) ? 'text-accent after:w-full' : 'after:w-0 hover:after:w-full'}
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-200 dark:border-slate-800 md:border-t-0">
            {currentUser ? (
              <>
                <button 
                  className={`
                    flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm border 
                    transition-colors outline-none cursor-pointer
                    ${isPortal 
                      ? 'bg-accent text-white border-accent' 
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'}
                  `}
                  onClick={() => { navigate(`/portal/${activeRole}`); setMobileMenuOpen(false); }}
                >
                  <LayoutDashboard size={15} />
                  <span className="capitalize">Dashboard ({activeRole})</span>
                </button>
                <button 
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors cursor-pointer outline-none"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button 
                className="flex items-center justify-center gap-2 py-2 px-5 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm cursor-pointer outline-none" 
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              >
                <span>Login</span>
                <ArrowRight size={15} />
              </button>
            )}
          </li>
          <li className="md:ml-2">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
