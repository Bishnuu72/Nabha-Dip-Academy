import React, { useState } from 'react';
import { BookOpen, Compass, Download, Cpu, Award, Layers } from 'lucide-react';

const Academics = () => {
  const [activeStream, setActiveStream] = useState('montessori'); // montessori, preprimary, primarysecondary

  const streamInfo = {
    montessori: {
      title: 'Montessori Program (Beginner Children)',
      desc: 'Our Montessori program is designed for beginner children aged 2.5 to 4 years. It prioritizes sensory learning, cognitive growth, and social adaptation through self-directed play, motor skill exercises, and creative expression.',
      subjects: [
        { code: 'MON-01', name: 'Practical Life Activities (Hand-Eye Coordination)' },
        { code: 'MON-02', name: 'Sensorial Exploration (Shapes, Sizes & Colors)' },
        { code: 'MON-03', name: 'Language Foundations (English & Nepali Phonics)' },
        { code: 'MON-04', name: 'Mathematical Concept Induction' }
      ],
      careerPaths: ['Pre-Primary Preparedness', 'Social Adaptability', 'Fine Motor Development', 'Cognitive Focus'],
      labFacility: 'Access to custom wooden Montessori toys, puzzles, and sensory blocks.'
    },
    preprimary: {
      title: 'Pre-Primary Wing (Nursery, LKG, UKG)',
      desc: 'Our Pre-Primary curriculum offers structured preparation in reading, writing, numbers, and creative arts, easing children into standard primary school routines.',
      subjects: [
        { code: 'PPR-101', name: 'English Writing & Phonics' },
        { code: 'PPR-102', name: 'Nepali Varnamala & Vocabulary' },
        { code: 'PPR-103', name: 'Basic Arithmetic & Counting' },
        { code: 'PPR-104', name: 'General Knowledge & Environment' },
        { code: 'PPR-105', name: 'Creative Arts, Crafts & Coloring' }
      ],
      careerPaths: ['Primary School Readiness', 'Bilingual Vocabulary', 'Cooperative Play Values', 'Basic Writing Literacy'],
      labFacility: 'Equipped with indoor toy bays and interactive digital presentation screens.'
    },
    primarysecondary: {
      title: 'Primary & Secondary Education (Class 1 to 10)',
      desc: 'Aligned with the National Curriculum Framework of Nepal. Prepares students for Secondary Education Examination (SEE) board evaluations, focusing on core sciences, mathematics, social studies, and digital literacy.',
      subjects: [
        { code: 'MTH-201', name: 'Compulsory Mathematics' },
        { code: 'ENG-202', name: 'Compulsory English' },
        { code: 'NEP-203', name: 'Compulsory Nepali' },
        { code: 'SCI-204', name: 'Science & Technology (Theory + Practical)' },
        { code: 'SOC-205', name: 'Social Studies & Civic Education' },
        { code: 'COM-206', name: 'Computer Science / Optional Math' }
      ],
      careerPaths: ['SEE Examination Excellence', 'Secondary Level Graduation', 'Technical Stream Entry', 'Analytical Skill Development'],
      labFacility: 'Full access to Science Laboratories, Computer Centers, and Library Racks.'
    }
  };

  const currentStream = streamInfo[activeStream];

  return (
    <div className="min-h-screen flex flex-col font-sans pb-20 animate-[fadeIn_0.3s_ease-out_forwards]">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 w-full pt-16 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Academic Excellence</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Our Academic Programs</h1>
        <p className="max-w-2xl text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
          We offer specialized Higher Secondary streams (+2 level) in Science, Management, and Humanities, certified by the National Examinations Board.
        </p>
      </section>

      {/* Stream Tabs Selector */}
      <div className="max-w-7xl mx-auto px-6 w-full mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { id: 'montessori', label: 'Montessori Group' },
            { id: 'preprimary', label: 'Pre-Primary (Nursery-UKG)' },
            { id: 'primarysecondary', label: 'Primary & Secondary (1-10)' }
          ].map((stream) => (
            <button 
              key={stream.id}
              className={`
                py-2.5 px-6 rounded-lg font-bold text-sm cursor-pointer select-none transition-all outline-none border
                ${activeStream === stream.id 
                  ? 'bg-accent text-white border-accent shadow-sm' 
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-800'}
              `}
              onClick={() => setActiveStream(stream.id)}
            >
              <span>{stream.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stream Details Card */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-16">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-10 shadow-md border border-slate-200 dark:border-slate-805">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10 pb-10 border-b border-slate-200/80 dark:border-slate-800/80">
            {/* Stream Info */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {currentStream.title}
              </h2>
              <p className="text-sm md:text-base text-slate-650 dark:text-slate-400 leading-relaxed">
                {currentStream.desc}
              </p>

              {/* Career Paths */}
              <div>
                <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Compass size={16} className="text-accent" />
                  <span>Key Career Pathways</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentStream.careerPaths.map((path, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-accent-light text-accent py-1 px-3 rounded-full border border-accent/15">
                      {path}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Syllabus Download list */}
            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-950/45 p-6 rounded-xl border border-slate-200/50 dark:border-slate-850 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Download size={16} className="text-accent" />
                <span>Curriculum Downloads</span>
              </h4>
              <ul className="list-none flex flex-col gap-2.5">
                <li className="flex justify-between items-center p-3 bg-white dark:bg-slate-905 rounded-lg text-xs md:text-sm font-semibold border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  <span className="text-slate-700 dark:text-slate-350">Grade 11 Syllabus (2026)</span>
                  <a href="#" className="text-accent hover:text-accent-hover flex items-center gap-1 font-bold" onClick={(e) => { e.preventDefault(); alert('Downloading Grade 11 Syllabus...'); }}>
                    Download
                  </a>
                </li>
                <li className="flex justify-between items-center p-3 bg-white dark:bg-slate-905 rounded-lg text-xs md:text-sm font-semibold border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  <span className="text-slate-700 dark:text-slate-350">Grade 12 Syllabus (2026)</span>
                  <a href="#" className="text-accent hover:text-accent-hover flex items-center gap-1 font-bold" onClick={(e) => { e.preventDefault(); alert('Downloading Grade 12 Syllabus...'); }}>
                    Download
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Subjects Table */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <BookOpen size={18} className="text-accent" />
              <span>Syllabus & Subject Roster</span>
            </h3>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800/80">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60">
                    <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Code</th>
                    <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Subject Name</th>
                    <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Laboratory Practical</th>
                    <th className="p-3.5 px-5 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">Exam Weightage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/65 bg-white dark:bg-slate-900">
                  {currentStream.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="p-3.5 px-5 font-bold text-slate-900 dark:text-slate-200">{sub.code}</td>
                      <td className="p-3.5 px-5 text-slate-700 dark:text-slate-300">{sub.name}</td>
                      <td className="p-3.5 px-5">
                        {sub.name.includes('Practical') ? (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-55">Required</span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">None</span>
                        )}
                      </td>
                      <td className="p-3.5 px-5 text-slate-550 dark:text-slate-450">75% Board + 25% Internal Assignment</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-6 w-full pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">Resource Pillars</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Supportive Lab & Smart Resources</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: 'Next-Gen Computer Lab', desc: 'Equipped with 100+ fully-configured terminals, high-speed fiber internet, and developer IDE sandboxes.' },
            { icon: Award, title: 'Continuous Review', desc: 'Weekly tests and online assignments help students stay prepared for final national board certifications.' },
            { icon: Layers, title: 'Digital Course Materials', desc: 'All classroom handouts and syllabus guides are converted to PDFs and posted online for immediate reference.' }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 text-center shadow-xs">
                <div className="text-accent mb-3.5 inline-flex bg-accent-light p-3 rounded-lg"><Icon size={24} /></div>
                <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white mb-2">{feat.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
      
    </div>
  );
};

export default Academics;
