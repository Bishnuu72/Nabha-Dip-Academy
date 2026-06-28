import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const { setActivePage, schoolConfig } = useContext(AppContext);

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {schoolConfig?.schoolLogo ? (
                <img src={schoolConfig.schoolLogo} alt="NDA Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm border border-slate-700 bg-white" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-accent text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
                  NDA
                </div>
              )}
              <div>
                <h2 className="text-lg font-extrabold text-white leading-none tracking-tight">Nabha Dip Academy</h2>
                <span className="text-[9px] text-accent uppercase tracking-wider font-bold block mt-0.5">Secondary English School</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Empowering young minds, fostering creativity, and cultivating academic excellence since our establishment in 2066 B.S. (2009 A.D.).
            </p>
            <div className="flex gap-2.5 mt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-850 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-850 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-850 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-850 hover:bg-accent hover:text-white flex items-center justify-center text-slate-400 transition-all duration-300 hover:-translate-y-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-accent">
              Quick Links
            </h3>
            <ul className="list-none flex flex-col gap-3">
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('home')}>Home</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('about')}>About Us</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('academics')}>Academics</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('admissions')}>Admissions</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('contact')}>Contact Us</button></li>
            </ul>
          </div>

          {/* Academic Portals */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-accent">
              Program Stream
            </h3>
            <ul className="list-none flex flex-col gap-3">
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('academics')}>Science Stream</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('academics')}>Management Stream</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('academics')}>Humanities Stream</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('admissions')}>Fee Schedule</button></li>
              <li><button className="text-sm text-slate-400 hover:text-accent text-left transition-all hover:translate-x-1 duration-200" onClick={() => handleNavClick('admissions')}>Online Apply</button></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-accent">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-3.5 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-tight">Greenwood Marg, Sector-4, Lalitpur, Nepal</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={15} className="text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-tight">+977-1-5544332, 5544333</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-accent mt-0.5 flex-shrink-0" />
                <span className="leading-tight">info@evergreen.edu.np</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Nabha Dip Academy. All Rights Reserved.</span>
          <span>Designed with Premium Tailwind CSS v4 & React</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
