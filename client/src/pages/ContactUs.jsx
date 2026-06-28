import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const ContactUs = () => {
  const { addInquiry } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry(formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans pb-20 animate-[fadeIn_0.3s_ease-out_forwards] select-none">
      
      {/* Toast Alert */}
      {submitted && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} />
          <span>Inquiry received! We will reply back shortly.</span>
        </div>
      )}

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 w-full pt-16 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Reach Out</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Contact Us</h1>
        <p className="max-w-2xl text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
          Have queries about admissions, fees, or early Montessori slots? Drop us a line or visit our Lalitpur campus.
        </p>
      </section>

      {/* Grid: Details and Inquiry Form */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Info Panels */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 flex gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Campus Location</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  Greenwood Marg, Sector-4,<br />Lalitpur, Nepal (Near Central Zoo)
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 flex gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Phone Numbers</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  Admission Desk: +977-1-5544332<br />Administration Office: +977-1-5544333
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 flex gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Email Support</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  General Queries: info@evergreen.edu.np<br />Admissions: admissions@evergreen.edu.np
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-805 flex gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-accent-light text-accent flex items-center justify-center shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Office Hours</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-normal">
                  Sunday - Friday: 8:00 AM - 4:00 PM<br />Saturday: Closed
                </p>
              </div>
            </div>
            
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-805 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              Send Us an Inquiry
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Sanjay Thapa" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="e.g. sanjay@example.com" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Subject</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  placeholder="Inquiry Topic" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Message Details</label>
                <textarea 
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent resize-y" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Describe your question or message here..." 
                  rows="5" 
                  required 
                ></textarea>
              </div>

              <button type="submit" className="w-full py-3 rounded-lg font-bold text-sm bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors mt-2 outline-none">
                <Send size={15} /> Send Inquiry
              </button>
            </form>
          </div>
          
        </div>
      </section>

      {/* Styled vector map placeholder */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="w-full h-80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative flex items-center justify-center shadow-md bg-slate-100 dark:bg-slate-950/40">
          
          {/* Custom Visual Map Grids */}
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900/60 opacity-60" style={{ 
            backgroundImage: "radial-gradient(circle, transparent 20%, #f8fafc 20%, #f8fafc 80%, transparent 80%, transparent) 0% 0% / 20px 20px, linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundColor: "var(--bg-sidebar)" 
          }}></div>
          
          <div className="relative z-10 text-center max-w-xs p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-2 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="text-red-500 animate-[bounce_2s_infinite]">
              <MapPin size={34} fill="currentColor" color="white" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Nabha Dip Academy Campus</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-normal">
              Greenwood Marg, Sector-4, Lalitpur, Nepal
            </p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1.5 mt-2 py-1.5 px-4 rounded border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
