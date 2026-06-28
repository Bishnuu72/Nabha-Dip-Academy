import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import HeroCarousel from '../components/HeroCarousel';
import { Calendar, Bell, Download, Clock, MapPin, X, Megaphone, MessageCircle, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { notices, events, announcements, testimonials, registerForEvent, schoolConfig, usersList, currentUser } = useContext(AppContext);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [showRegisterToast, setShowRegisterToast] = useState(false);
  const [testimonialsPaused, setTestimonialsPaused] = useState(false);

  // Merge all admin records from Firestore (most complete data wins), fallback to currentUser, then hardcoded default
  const admins = (usersList || []).filter(u => u.role === 'admin');
  const mergedAdmin = admins.length > 0 ? Object.assign({}, ...admins) : null;
  const principal = mergedAdmin
    || (currentUser?.role === 'admin' ? currentUser : null)
    || {
      name: "Dr. Anand Verma",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
      welcomeMessage: "At Nabha Dip Academy, we believe in a holistic learning approach that blends rigorous academic curricula with vibrant extracurricular participation. Our goal is to prepare students to be innovative problem solvers, ethical leaders, and empathetic global citizens. Our highly competent faculty, world-class labs, and supportive parent community have enabled us to excel consistently. I welcome you to explore our campus and build a robust foundation for your future."
    };

  const handleRegisterEvent = (id) => {
    if (registeredEventIds.includes(id)) return;
    registerForEvent(id);
    setRegisteredEventIds([...registeredEventIds, id]);
    setShowRegisterToast(true);
    setTimeout(() => setShowRegisterToast(false), 3000);
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  const closeNoticeModal = () => {
    setSelectedNotice(null);
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300 font-sans pb-16">
      
      {/* Toast Alert */}
      {showRegisterToast && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <span>Successfully registered for this event! See you there.</span>
        </div>
      )}

      {/* Hero Carousel */}
      <HeroCarousel images={schoolConfig?.heroImages || []}>
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-accent bg-accent-light px-4 py-1.5 rounded-full border border-accent/25">
            Academic Excellence Since 2066 B.S. (2009 A.D.)
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight max-w-3xl">
            Shaping Leaders, Inspiring Excellence, Innovating Tomorrow
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-slate-350 max-w-2xl leading-relaxed">
            Welcome to Nabha Dip Academy Secondary English School, where students develop global competence, critical thinking, and strong values to conquer tomorrow's challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto justify-center">
            <button 
              className="inline-flex items-center justify-center gap-2 py-3 px-7 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md cursor-pointer"
              onClick={() => navigate('/admissions')}
            >
              Apply Online 2083
            </button>
            <button 
              className="inline-flex items-center justify-center gap-2 py-3 px-7 rounded-lg font-bold text-sm bg-transparent text-white border-2 border-white hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/academics')}
            >
              Explore Programs
            </button>
          </div>
        </div>
      </HeroCarousel>

      {/* Announcement Marquee Ticker */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-12">
        <div className="flex items-center gap-4 bg-slate-900 text-white py-3 px-4 rounded-lg overflow-hidden shadow-md">
          <div className="flex items-center gap-1.5 bg-accent py-1 px-3 text-[10px] font-extrabold uppercase rounded text-white animate-pulse shrink-0">
            <Bell size={13} />
            <span>Flash Notices</span>
          </div>
          <div className="overflow-hidden w-full whitespace-nowrap">
            {(() => {
              const text = notices.map((n) => `🔥 [${n.date}] - ${n.title} • `).join('      ');
              const duration = Math.max(15, text.length * 0.12);
              return (
                <span className="inline-block text-xs md:text-sm font-semibold select-none" style={{ animation: `marquee ${duration}s linear infinite` }}>
                  {text}
                </span>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full">
        
        {/* Principal Message Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 shadow-md border border-slate-200 dark:border-slate-800 mb-16">
          <div className="md:col-span-1 h-72 md:h-[320px] rounded-xl overflow-hidden shadow-md">
            <img 
              src={principal.profileImage || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80"} 
              alt={`Principal ${principal.name}`} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-2 flex flex-col justify-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Welcome Message</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Message from the Principal</h2>
            <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed text-sm md:text-base">
              &ldquo;{principal.welcomeMessage || 'At Nabha Dip Academy, we believe in a holistic learning approach that blends rigorous academic curricula with vibrant extracurricular participation. Our goal is to prepare students to be innovative problem solvers, ethical leaders, and empathetic global citizens.'}&rdquo;
            </p>
            <div>
              <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">{principal.name}</h4>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mt-0.5 font-sans">Principal, Nabha Dip Academy</span>
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { num: '1,500+', label: 'Active Students' },
            { num: '75+', label: 'Expert Faculty' },
            { num: '98%', label: 'Pass Percentage' },
            { num: '28+', label: 'Years of Glory' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center shadow-md border-b-4 border-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-250 border-x border-t border-slate-200 dark:border-slate-800">
              <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-none">{stat.num}</div>
              <div className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-2">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Announcements Cards */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20">
                    <Megaphone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Latest Announcements</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Stay updated with school news & achievements</p>
                  </div>
                </div>
                <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent -mx-2 px-2">
                  {announcements.map((item) => {
                    const typeConfig = {
                      general: { gradient: 'from-slate-500/10 to-gray-600/5', border: 'border-slate-500/20', badge: 'bg-slate-500/15 text-slate-300', icon: '📢', glow: 'shadow-slate-500/10' },
                      achievement: { gradient: 'from-amber-500/15 to-yellow-600/5', border: 'border-amber-500/25', badge: 'bg-amber-500/15 text-amber-300', icon: '🏆', glow: 'shadow-amber-500/15' },
                      notice: { gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/25', badge: 'bg-blue-500/15 text-blue-300', icon: '📋', glow: 'shadow-blue-500/15' },
                      event: { gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/25', badge: 'bg-emerald-500/15 text-emerald-300', icon: '🎉', glow: 'shadow-emerald-500/15' }
                    };
                    const cfg = typeConfig[item.type] || typeConfig.general;
                    return (
                      <div key={item.id} className={`min-w-[320px] max-w-[380px] shrink-0 rounded-2xl p-6 bg-gradient-to-br ${cfg.gradient} ${cfg.border} border shadow-lg ${cfg.glow} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden group`}>
                        {/* Decorative corner accent */}
                        <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full ${cfg.badge.replace('text-', 'bg-').replace('bg-', 'bg-')} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${cfg.badge} flex items-center gap-1.5`}>
                            <span className="text-[11px]">{cfg.icon}</span> {item.type}
                          </span>
                          {item.date && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                              <Calendar size={10} /> {item.date}
                            </span>
                          )}
                        </div>
                        {/* Title */}
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5 leading-snug">{item.title}</h3>
                        {/* Content */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.content}</p>
                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 dark:border-white/5">
                          {item.linkUrl ? (
                            <a href={item.linkUrl} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors group/link">
                              Learn More
                              <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                            </a>
                          ) : (
                            <span />
                          )}
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium">Nabha Dip Academy</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right side text */}
              <div className="lg:col-span-1 flex flex-col justify-center">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 md:p-7 border border-slate-700/50 shadow-lg relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-amber-500/5 blur-xl" />
                  <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-blue-500/5 blur-xl" />
                  <div className="relative z-10">
                    <div className="p-2 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 mb-5">
                      <Megaphone className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Stay Informed</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      Get the latest updates, achievements, notices, and events from Nabha Dip Academy right here. 
                      Check back regularly to never miss an important announcement.
                    </p>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        School-wide notifications
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        Student achievements
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        Upcoming events
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        General notices
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''} this season</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Split Grid - Notices & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-8">
          
          {/* Upcoming Events */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Campus Life</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Upcoming Events</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {events.map((event) => {
                const isRegistered = registeredEventIds.includes(event.id);
                return (
                  <div key={event.id} className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-805 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                    <img src={event.image} alt={event.title} className="w-full sm:w-36 h-36 sm:h-auto object-cover shrink-0" />
                    <div className="p-5 flex flex-col justify-between w-full gap-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{event.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{event.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1 font-medium"><Calendar size={12} className="text-accent" /> {event.date}</span>
                          <span className="flex items-center gap-1 font-medium"><Clock size={12} className="text-accent" /> {event.time} | {event.location}</span>
                        </div>
                        <button 
                          className={`
                            py-1.5 px-4 rounded font-bold text-xs cursor-pointer select-none transition-all duration-200 outline-none
                            ${isRegistered 
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700' 
                              : 'bg-accent text-white hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0'}
                          `}
                          onClick={() => handleRegisterEvent(event.id)}
                          disabled={isRegistered}
                        >
                          {isRegistered ? 'Registered ✔' : 'Register RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* School Notice Board */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Information Board</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Recent Notices</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {notices.map((notice) => {
                let catBorder = 'border-l-slate-400';
                if (notice.category === 'academic') catBorder = 'border-l-blue-500';
                if (notice.category === 'events') catBorder = 'border-l-amber-500';
                if (notice.category === 'administrative') catBorder = 'border-l-emerald-500';
                
                return (
                  <div key={notice.id} className={`bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-805 hover:shadow-md transition-all duration-200 border-l-4 ${catBorder}`}>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`
                        text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${notice.category === 'academic' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' : ''}
                        ${notice.category === 'events' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' : ''}
                        ${notice.category === 'administrative' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : ''}
                      `}>
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{notice.date}</span>
                    </div>
                    <h3 
                      className="text-sm font-extrabold text-slate-900 dark:text-white hover:text-accent cursor-pointer transition-colors leading-snug mb-2"
                      onClick={() => handleNoticeClick(notice)}
                    >
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {notice.content.substring(0, 95)}...
                    </p>
                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <button 
                        className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-accent transition-colors cursor-pointer"
                        onClick={() => handleNoticeClick(notice)}
                      >
                        Read Details
                      </button>
                      <a 
                        href="#" 
                        className="flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent-hover"
                        onClick={(e) => { e.preventDefault(); alert('Simulated PDF Download Started!'); }}
                      >
                        <Download size={12} /> PDF Copy
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="w-full mb-16 py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent dark:via-emerald-500/[0.03]">
          {/* Decorative background blobs */}
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-emerald-400/5 dark:bg-emerald-400/[0.04] blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-teal-400/5 dark:bg-teal-400/[0.04] blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/10 dark:from-emerald-400/15 dark:to-teal-500/10 border border-emerald-400/20 dark:border-emerald-400/15 shadow-lg shadow-emerald-500/5">
                  <MessageCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    What <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">People</span> Say
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wide">Real voices from our community</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Auto-scrolling carousel */}
          <div className="relative group">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/90 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/90 to-transparent pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex gap-6 animate-testimonial-scroll"
                style={{ animationPlayState: testimonialsPaused ? 'paused' : 'running' }}
                onMouseEnter={() => setTestimonialsPaused(true)}
                onMouseLeave={() => setTestimonialsPaused(false)}>
                {[...testimonials, ...testimonials].map((item, idx) => (
                  <div key={`${item.id}-${idx}`}
                    className="min-w-[320px] md:min-w-[370px] w-[320px] md:w-[370px] shrink-0 rounded-2xl p-6 md:p-7 relative flex flex-col group/card
                      bg-white/90 dark:bg-slate-800/90
                      backdrop-blur-xl
                      border border-slate-200/70 dark:border-slate-700/50
                      shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.35)]
                      hover:shadow-[0_12px_40px_-8px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_12px_40px_-8px_rgba(16,185,129,0.1)]
                      hover:-translate-y-1 transition-all duration-300">
                    {/* Card inner gradient overlay (light mode subtle, dark mode rich) */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-slate-50/60 dark:from-slate-700/30 dark:to-slate-800/40 pointer-events-none" />

                    {/* Top gradient line */}
                    <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 rounded-full opacity-60 dark:opacity-70" />

                    {/* Quote icon */}
                    <div className="absolute -top-3 -left-2 text-6xl text-emerald-400/10 dark:text-emerald-400/15 font-serif leading-none select-none">&ldquo;</div>

                    {/* Rating */}
                    {item.rating && (
                      <div className="flex gap-1 mb-3 relative z-10">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-[15px] h-[15px] ${star <= item.rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm dark:drop-shadow-[0_0_4px_rgba(250,204,21,0.3)]' : 'text-slate-300 dark:text-slate-600'}`} />
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <p className="text-sm md:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed flex-1 relative z-10 mb-5 line-clamp-5 italic">
                      &ldquo;{item.content}&rdquo;
                    </p>

                    {/* Bottom section with person */}
                    <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 dark:border-slate-700/60 relative z-10">
                      {item.personPhoto ? (
                        <div className="relative shrink-0">
                          <img src={item.personPhoto} alt={item.personName} className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover border-2 border-emerald-400/40 dark:border-emerald-400/30 shadow-md dark:shadow-emerald-500/10" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-emerald-400 border-[1.5px] border-white dark:border-slate-800 flex items-center justify-center">
                            <MessageCircle className="w-1.5 h-1.5 md:w-2 md:h-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md ring-2 ring-emerald-400/30 dark:ring-emerald-400/20">
                          {(item.personName || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{item.personName}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mt-0.5">{item.personRole || item.personType}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      )}

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 w-full h-full bg-slate-950/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl w-full max-w-xl relative shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out_forwards]">
            <button data-tip="Close"
              onClick={closeNoticeModal}
              className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer outline-none"
            >
              <X size={22} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`
                text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                ${selectedNotice.category === 'academic' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' : ''}
                ${selectedNotice.category === 'events' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' : ''}
                ${selectedNotice.category === 'administrative' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : ''}
              `}>
                {selectedNotice.category}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Posted: {selectedNotice.date}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mt-1">
              {selectedNotice.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line my-2">
              {selectedNotice.content}
            </p>
            <div className="flex gap-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <button 
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all shadow cursor-pointer"
                onClick={() => { alert('Downloading PDF...'); }}
              >
                <Download size={13} /> Download PDF Announcement
              </button>
              <button 
                className="inline-flex items-center justify-center gap-2 py-2 px-5 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                onClick={closeNoticeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
