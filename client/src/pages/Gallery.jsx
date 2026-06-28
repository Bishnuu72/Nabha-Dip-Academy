import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = ['all', 'sports', 'annual', 'campus'];

const Gallery = () => {
  const { gallery } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);

  const filtered = activeCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  const catLabel = {
    all: 'All Photos',
    sports: 'Sports Events',
    annual: 'Annual Functions',
    campus: 'Campus Life',
  };

  const catColors = {
    sports: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200',
    annual: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200',
    campus: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200',
  };

  return (
    <div className="min-h-screen flex flex-col font-sans pb-20 animate-[fadeIn_0.3s_ease-out_forwards]">

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxImg(null)}
        >
          <button data-tip="Close"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer outline-none"
            onClick={() => setLightboxImg(null)}
          >
            <X size={22} />
          </button>
          <div
            className="max-w-4xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg.url}
              alt={lightboxImg.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center">
              <h3 className="text-white font-extrabold text-lg">{lightboxImg.title}</h3>
              {lightboxImg.description && (
                <p className="text-slate-400 text-sm mt-1">{lightboxImg.description}</p>
              )}
              {lightboxImg.category && (
                <span className={`inline-block mt-2 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${catColors[lightboxImg.category] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {catLabel[lightboxImg.category] || lightboxImg.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section
        className="relative bg-cover bg-center text-white py-16 md:py-24 px-6 rounded-b-[30px] md:rounded-b-[40px] mb-12 shadow-lg overflow-hidden select-none"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.80) 100%), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80')"
        }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-accent bg-accent-light px-4 py-1.5 rounded-full border border-accent/25">
            Campus Memories
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            School Photo Gallery
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
            Glimpses of life at Nabha Dip Academy — sports events, annual functions, campus life, and unforgettable moments.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 w-full">

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                py-2 px-5 rounded-full font-bold text-xs transition-all duration-200 border cursor-pointer outline-none
                ${activeCategory === cat
                  ? 'bg-accent text-white border-accent shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-accent hover:text-accent'}
              `}
            >
              {catLabel[cat]}
              {cat !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  ({gallery.filter(g => g.category === cat).length})
                </span>
              )}
              {cat === 'all' && (
                <span className="ml-1.5 opacity-70">({gallery.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
              <ImageIcon size={36} />
            </div>
            <h3 className="text-slate-700 dark:text-slate-300 font-extrabold text-lg">No Photos Yet</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm leading-relaxed">
              {activeCategory === 'all'
                ? 'No photos have been uploaded yet. The admin can add photos via the Admin Portal → Manage Gallery.'
                : `No photos in the "${catLabel[activeCategory]}" category yet.`}
            </p>
          </div>
        )}

        {/* Masonry-style Photo Grid */}
        {filtered.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-100 dark:bg-slate-900"
                onClick={() => setLightboxImg(item)}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full object-cover block transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-1">
                      {item.category && (
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${catColors[item.category] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {catLabel[item.category] || item.category}
                        </span>
                      )}
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <ZoomIn size={14} />
                      </div>
                    </div>
                    <h4 className="text-white font-extrabold text-sm leading-snug">{item.title}</h4>
                    {item.description && (
                      <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium mt-12">
            Showing {filtered.length} {filtered.length === 1 ? 'photo' : 'photos'}
            {activeCategory !== 'all' ? ` in "${catLabel[activeCategory]}"` : ' across all categories'}
          </p>
        )}

      </div>
    </div>
  );
};

export default Gallery;
