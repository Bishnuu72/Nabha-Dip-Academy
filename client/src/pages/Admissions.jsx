import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Admissions = () => {
  const { applyAdmission } = useContext(AppContext);

  // Form Step State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    contact: '',
    birthDate: '',
    stream: 'Montessori',
    grade: 'Montessori',
    gpa: '',
    prevSchool: '',
    parentName: '',
    parentPhone: '',
    parentEmail: ''
  });

  // Calculator State
  const [calcStream, setCalcStream] = useState('Montessori');
  const [calcHostel, setCalcHostel] = useState('no');
  
  // Submit alert state
  const [appId, setAppId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Constants for Calculator
  const fees = {
    Montessori: { admission: 10000, tuition: 3000, labs: 1000 },
    Nursery: { admission: 12000, tuition: 3500, labs: 1000 },
    LKG: { admission: 12000, tuition: 3500, labs: 1000 },
    UKG: { admission: 12000, tuition: 3500, labs: 1000 },
    'Primary (1-5)': { admission: 15000, tuition: 4500, labs: 1500 },
    'Secondary (6-10)': { admission: 18000, tuition: 5500, labs: 2000 }
  };
  const hostelFee = 15000; // per quarter

  const calculateTotal = () => {
    const streamFees = fees[calcStream];
    const quarterlyTuition = streamFees.tuition * 3;
    const additional = streamFees.labs;
    const hostel = calcHostel === 'yes' ? hostelFee : 0;
    return streamFees.admission + quarterlyTuition + additional + hostel;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stream') {
      let defaultGrade = 'Montessori';
      if (value === 'Pre-Primary') defaultGrade = 'Nursery';
      else if (value === 'Primary') defaultGrade = 'Class 1';
      else if (value === 'Secondary') defaultGrade = 'Class 6';
      setFormData({ ...formData, stream: value, grade: defaultGrade });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = applyAdmission(formData);
    setAppId(id);
    setShowSuccess(true);
    // Reset Form
    setFormData({
      studentName: '',
      email: '',
      contact: '',
      birthDate: '',
      stream: 'Montessori',
      grade: 'Montessori',
      gpa: '',
      prevSchool: '',
      parentName: '',
      parentPhone: '',
      parentEmail: ''
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans pb-20 animate-[fadeIn_0.3s_ease-out_forwards]">
      
      {/* Success Modal Dialogue */}
      {showSuccess && (
        <div className="fixed inset-0 w-full h-full bg-slate-950/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl w-full max-w-md text-center shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
            <div className="text-emerald-500">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Application Submitted!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
              Your online application has been received successfully. Your Application reference code is <strong className="text-slate-950 dark:text-white font-extrabold">{appId}</strong>. 
              Our team will review your qualifications and contact you for the entrance examination details.
            </p>
            <button 
              className="w-full py-3 rounded-lg font-bold text-sm bg-accent text-white hover:bg-accent-hover transition-colors shadow cursor-pointer mt-2"
              onClick={() => setShowSuccess(false)}
            >
              Okay, Thanks
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-6 w-full pt-16 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">Admissions 2083 B.S.</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Join Nabha Dip Academy</h1>
        <p className="max-w-2xl text-slate-500 dark:text-slate-400 text-sm md:text-base mt-2 leading-relaxed">
          Explore our requirements, calculate your quarterly tuition invoices, and complete the digital application form.
        </p>
      </section>

      {/* Split Roster: Requirements & Application Form */}
      <section className="max-w-7xl mx-auto px-6 w-full mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Requirements & Info */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-805 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Admission Requirements
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-5">
                Please ensure you meet the eligibility criteria before applying:
              </p>
              <ul className="flex flex-col gap-4 list-none">
                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-350">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Montessori & Pre-Primary:</strong> Admissions open for children above 2.5 years of age. Birth certificate required.</span>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-350">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Primary Wing (Class 1-5):</strong> Transfer certificate from previous school required. Basic interview clearance.</span>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-350">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Secondary Wing (Class 6-10):</strong> Score threshold on Nabha Dip admission assessment test. Previous marksheets required.</span>
                </li>
                <li className="flex items-start gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-350">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Required Documents:</strong> Scanned copy of character certificate, grade marks sheet, and passport-size photograph.</span>
                </li>
              </ul>

              <div className="mt-6 p-4.5 bg-slate-50 dark:bg-slate-950/40 rounded-lg border-l-4 border-accent flex gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Entrance Examination:</strong> All applications must undergo an entrance exam (Multiple Choice Questions) covering Core English, Math, and General Aptitude.
                </span>
              </div>
            </div>

            {/* Fee Calculator Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-805 shadow-sm mt-8">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">
                Tuition Fee Estimator
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Select Grade Level</label>
                  <select 
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-accent" 
                    value={calcStream} 
                    onChange={(e) => setCalcStream(e.target.value)}
                  >
                    <option value="Montessori">Montessori</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Primary (1-5)">Class 1 to 5</option>
                    <option value="Secondary (6-10)">Class 6 to 10</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Hostel Option</label>
                  <select 
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-accent" 
                    value={calcHostel} 
                    onChange={(e) => setCalcHostel(e.target.value)}
                  >
                    <option value="no">Day Scholar (No Hostel)</option>
                    <option value="yes">Hostel Boarder (Yes)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-250 dark:border-slate-800/80 flex justify-between items-center">
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-tight">Estimated Term Invoice</h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Includes admission, lab & hostel fees.</span>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-accent leading-none">
                  Rs. {calculateTotal().toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Multi-step Application Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-805 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Online Application Desk
              </h2>

              {/* Steps indicator */}
              <div className="flex justify-between items-center mb-8 relative after:content-[''] after:absolute after:top-4.5 after:left-0 after:right-0 after:h-[2px] after:bg-slate-200 dark:after:bg-slate-800 after:-z-1">
                {[
                  { num: 1, lbl: 'Personal' },
                  { num: 2, lbl: 'Academic' },
                  { num: 3, lbl: 'Parent' }
                ].map((s) => (
                  <div key={s.num} className={`
                    relative z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 text-xs font-extrabold flex items-center justify-center transition-all duration-200
                    ${step === s.num ? 'border-accent bg-accent! text-white! shadow-[0_0_0_4px_rgba(180,83,9,0.15)]' : ''}
                    ${step > s.num ? 'border-emerald-500 bg-emerald-500! text-white!' : ''}
                    ${step < s.num ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500' : ''}
                  `}>
                    {s.num}
                    <span className={`absolute top-10 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${step >= s.num ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>{s.lbl}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out_forwards]">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Student's Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                        name="studentName" 
                        value={formData.studentName} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Aarav Mehta"
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
                        placeholder="e.g. aarav@example.com"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Contact Number</label>
                        <input 
                          type="tel" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                          name="contact" 
                          value={formData.contact} 
                          onChange={handleInputChange} 
                          placeholder="98********"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Birth Date</label>
                        <input 
                          type="date" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-750 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                          name="birthDate" 
                          value={formData.birthDate} 
                          onChange={handleInputChange} 
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Details */}
                {step === 2 && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out_forwards]">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Select Target Stream</label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                        name="stream" 
                        value={formData.stream} 
                        onChange={handleInputChange}
                      >
                        <option value="Montessori">Montessori</option>
                        <option value="Pre-Primary">Pre-Primary</option>
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Select Target Grade</label>
                      <select 
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                        name="grade" 
                        value={formData.grade} 
                        onChange={handleInputChange}
                      >
                        {formData.stream === 'Montessori' && (
                          <option value="Montessori">Montessori</option>
                        )}
                        {formData.stream === 'Pre-Primary' && (
                          <>
                            <option value="Nursery">Nursery</option>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                          </>
                        )}
                        {formData.stream === 'Primary' && (
                          <>
                            {Array.from({ length: 5 }, (_, i) => (
                              <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                            ))}
                          </>
                        )}
                        {formData.stream === 'Secondary' && (
                          <>
                            {Array.from({ length: 5 }, (_, i) => (
                              <option key={i} value={`Class ${i + 6}`}>Class {i + 6}</option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Previous Grade/GPA Scored</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        max="4.00" 
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                        name="gpa" 
                        value={formData.gpa} 
                        onChange={handleInputChange} 
                        placeholder="e.g. 3.85"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Previous School Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                        name="prevSchool" 
                        value={formData.prevSchool} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Little Angels School"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Guardian Details */}
                {step === 3 && (
                  <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out_forwards]">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Guardian / Parent Full Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                        name="parentName" 
                        value={formData.parentName} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Rajesh Mehta"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Guardian Contact Phone</label>
                        <input 
                          type="tel" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                          name="parentPhone" 
                          value={formData.parentPhone} 
                          onChange={handleInputChange} 
                          placeholder="98********"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Guardian Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-350 text-sm outline-none focus:border-accent" 
                          name="parentEmail" 
                          value={formData.parentEmail} 
                          onChange={handleInputChange} 
                          placeholder="e.g. guardian@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 text-xs text-slate-400 mt-2">
                      <input type="checkbox" required className="mt-0.5 outline-none" id="agreeDecl" />
                      <label htmlFor="agreeDecl" className="leading-tight cursor-pointer select-none">I declare that all input information is true and verifiable. I understand that submitting fake details will revoke admissions.</label>
                    </div>
                  </div>
                )}

                {/* Form Buttons navigation */}
                <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {step > 1 ? (
                    <button 
                      type="button" 
                      className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg font-bold text-xs border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer outline-none" 
                      onClick={prevStep}
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {step < 3 ? (
                    <button 
                      type="button" 
                      className="inline-flex items-center gap-1.5 py-2 px-5 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer outline-none shadow-xs ml-auto" 
                      onClick={nextStep}
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="py-2.5 px-6 rounded-lg font-extrabold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer outline-none shadow ml-auto"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default Admissions;
