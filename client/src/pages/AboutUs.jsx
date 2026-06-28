import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Compass, Target } from 'lucide-react';

const AboutUs = () => {
  const { teachers } = useContext(AppContext);

  const timelineMilestones = [
    { year: '2066 B.S.', title: 'School Foundation Established', desc: 'Nabha Dip Academy Secondary English School was founded to deliver quality, English-medium education for children of Lalitpur.' },
    { year: '2072 B.S.', title: 'Montessori Wing Integration', desc: 'Launched specialized Montessori systems to support early childhood development with play-centered models.' },
    { year: '2078 B.S.', title: 'Secondary Level Upgrade', desc: 'Upgraded facilities to secondary level education, enabling classes up to Class 10 with advanced science & computer annexes.' },
    { year: '2083 B.S.', title: 'Digital Classrooms & Science Labs', desc: 'Installed digital display touch panels in classrooms and expanded physics and chemistry laboratories.' }
  ];

  // Faculty Mock Photos
  const facultyPhotos = {
    'T2001': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    'T2002': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    'T2003': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80'
  };

  const getFacultyPhoto = (id) => facultyPhotos[id] || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80';

  const [aboutImageModalUrl, setAboutImageModalUrl] = useState('');
  const [showAboutImageModal, setShowAboutImageModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans pb-20 animate-[fadeIn_0.3s_ease-out_forwards]">
      
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 w-full pt-16 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Who We Are</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">About Nabha Dip Academy</h1>
        <p className="max-w-2xl text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
          Nurturing academic brilliance and sound values since our founding in 2066 B.S. (2009 A.D.). We offer comprehensive learning channels from Montessori up to Class 10.
        </p>
      </section>

      {/* Vision & Mission Statements */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-805 shadow-md hover:scale-[1.01] transition-all duration-200">
            <div className="w-14 h-14 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-6">
              <Compass size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">Our Vision</h3>
            <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
              To be a global center of educational excellence, fostering environments where students are inspired to learn, lead, innovate, and contribute meaningfully to the betterment of humanity.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-805 shadow-md hover:scale-[1.01] transition-all duration-200">
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">Our Mission</h3>
            <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
              To deliver comprehensive, student-centered education through innovative technological tools, dynamic athletic events, robust leadership workshops, and active collaborative community engagements.
            </p>
          </div>
          
        </div>
      </section>

      {/* School Milestones / History */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-16">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 border border-slate-200 dark:border-slate-805 shadow-sm">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Journey Timeline</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Our Milestone Achievements</h2>
          </div>
          
          <div className="relative max-w-3xl mx-auto pl-8 border-l-2 border-slate-250 dark:border-slate-800">
            {timelineMilestones.map((item, index) => (
              <div key={index} className="relative mb-10 last:mb-0">
                <div className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white dark:border-slate-900 shadow-[0_0_0_4px_rgba(180,83,9,0.15)]"></div>
                <div className="text-base font-extrabold text-accent leading-none mb-2">{item.year}</div>
                <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-5 border border-slate-200/60 dark:border-slate-850 shadow-xs">
                  <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty details */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Our Faculty</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Meet Our Academic Leaders</h2>
          <p className="max-w-lg mx-auto text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-2 leading-relaxed">
            Our team comprises industry leaders, researchers, and dedicated educational experts committed to mentoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-805 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-250">
              <img src={teacher.profileImage || getFacultyPhoto(teacher.id)} alt={teacher.name} className="w-full h-56 object-cover cursor-pointer" onClick={() => { setAboutImageModalUrl(teacher.profileImage || getFacultyPhoto(teacher.id)); setShowAboutImageModal(true); }} />
              <div className="p-5">
                <span className="text-[10px] text-accent font-bold uppercase tracking-wider block mb-1">{(Array.isArray(teacher.streams) ? teacher.streams.join(', ') : teacher.stream || teacher.department || 'Faculty')}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{teacher.name}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">M.Sc. / Ph.D., Lead Instructor</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showAboutImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4" onClick={() => setShowAboutImageModal(false)}>
          <div className="max-w-4xl w-full">
            <img src={aboutImageModalUrl} alt="teacher" className="w-full h-auto rounded-lg object-contain shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
