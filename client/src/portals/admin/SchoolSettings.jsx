import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Camera, Upload, Image, Shield, CheckCircle, Trash2, MoveUp, MoveDown, Plus, Link } from 'lucide-react';
import { inputCls, compressImage } from './shared';

const SchoolSettings = () => {
  const { currentUser, schoolConfig, updateSchoolLogo, updatePrincipalProfile, changeAdminPassword, updateHeroImages } = useContext(AppContext);
  const [settingsName, setSettingsName] = useState(currentUser?.name || '');
  const [settingsWelcome, setSettingsWelcome] = useState(currentUser?.welcomeMessage || '');
  const [settingsProfileImage, setSettingsProfileImage] = useState(currentUser?.profileImage || '');
  const [settingsLogoImage, setSettingsLogoImage] = useState(schoolConfig?.schoolLogo || '');
  const [profileFile, setProfileFile] = useState(null);
  const [profileFilePreview, setProfileFilePreview] = useState(currentUser?.profileImage || '');
  const [logoFile, setLogoFile] = useState(null);
  const [logoFilePreview, setLogoFilePreview] = useState(schoolConfig?.schoolLogo || '');
  const [profileUploading, setProfileUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdChanging, setPwdChanging] = useState(false);

  const [heroImages, setHeroImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');
  const [heroUploading, setHeroUploading] = useState(false);

  // Sync local heroImages from schoolConfig on mount
  useEffect(() => {
    if (schoolConfig?.heroImages?.length) {
      setHeroImages([...schoolConfig.heroImages]);
    } else if (heroImages.length === 0) {
      setHeroImages([]);
    }
  }, [schoolConfig?.heroImages]);

  const [toast, setToast] = useState('');
  const triggerToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      let finalProfileImage = settingsProfileImage;
      let finalLogoImage = settingsLogoImage;
      if (profileFile) { setProfileUploading(true); const url = await compressImage(profileFile, 400); setProfileUploading(false); if (url) finalProfileImage = url; }
      if (logoFile) { setLogoUploading(true); const url = await compressImage(logoFile, 300); setLogoUploading(false); if (url) finalLogoImage = url; }
      await updatePrincipalProfile(settingsName, finalProfileImage, settingsWelcome);
      if (finalLogoImage && finalLogoImage !== (schoolConfig?.schoolLogo || '')) { await updateSchoolLogo(finalLogoImage); }
      await updateHeroImages(heroImages);
      setSettingsProfileImage(finalProfileImage); setSettingsLogoImage(finalLogoImage); setProfileFile(null); setLogoFile(null);
      triggerToast('School settings saved successfully!');
    } catch (err) { console.error('Settings save failed:', err); triggerToast('Failed to save settings.'); }
    setSettingsSaving(false);
  };

  const handleChangePassword = async () => {
    setPwdError(''); setPwdSuccess('');
    if (!pwdCurrent || !pwdNew || !pwdConfirm) { setPwdError('All password fields are required.'); return; }
    if (pwdNew !== pwdConfirm) { setPwdError('New password and confirmation do not match.'); return; }
    if (pwdNew.length < 6) { setPwdError('New password must be at least 6 characters.'); return; }
    setPwdChanging(true);
    const result = await changeAdminPassword(pwdCurrent, pwdNew);
    setPwdChanging(false);
    if (result.success) { setPwdSuccess('Password changed successfully!'); setPwdCurrent(''); setPwdNew(''); setPwdConfirm(''); triggerToast('Admin password updated!'); }
    else { setPwdError(result.error); }
  };

  return (
    <div className="animate-[fadeIn_0.2s_ease-out_forwards]">
      {toast && (
        <div className="fixed top-6 right-6 z-50 py-3.5 px-6 rounded-lg bg-emerald-500 text-white shadow-2xl flex items-center gap-3 font-semibold text-sm animate-bounce">
          <CheckCircle size={18} /><span>{toast}</span>
        </div>
      )}
      <form onSubmit={handleSaveSettings} className="flex flex-col gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
            <Camera size={18} className="text-accent" /><h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Principal Profile</h3>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent/30 shadow-lg bg-slate-100 dark:bg-slate-800">
                {profileFilePreview || settingsProfileImage ? <img src={profileFilePreview || settingsProfileImage} alt="Principal" className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500"><Camera size={28} /><span className="text-[9px] font-bold uppercase tracking-wider mt-1">No Photo</span></div>}
                {profileUploading && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60"><span className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" /></div>}
              </div>
              <label className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer flex items-center gap-1.5 outline-none">
                <Upload size={12} /> {profileFile ? 'Change Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { setProfileFile(f); setProfileFilePreview(URL.createObjectURL(f)); } }} />
              </label>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Principal's Full Name</label>
                <input type="text" className={inputCls} required placeholder="e.g. Dr. Anand Verma" value={settingsName} onChange={(e) => setSettingsName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Welcome Message</label>
                <textarea className={`${inputCls} resize-none`} rows={5} placeholder="Write the principal's welcome message..." value={settingsWelcome} onChange={(e) => setSettingsWelcome(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Or Enter Image URL</label>
                <input type="url" className={inputCls} placeholder="https://example.com/principal-photo.jpg" value={settingsProfileImage} onChange={(e) => setSettingsProfileImage(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
            <Image size={18} className="text-accent" /><h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">School Logo</h3>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow bg-white flex items-center justify-center relative">
                {logoFilePreview || settingsLogoImage ? <img src={logoFilePreview || settingsLogoImage} alt="School Logo" className="w-full h-full object-contain p-2" /> :
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600"><Image size={28} /><span className="text-[9px] font-bold uppercase tracking-wider mt-1">No Logo</span></div>}
                {logoUploading && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl"><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /></div>}
              </div>
              <label className="py-1.5 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer flex items-center gap-1.5 outline-none">
                <Upload size={12} /> {logoFile ? 'Change Logo' : 'Upload Logo'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { setLogoFile(f); setLogoFilePreview(URL.createObjectURL(f)); } }} />
              </label>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Or Enter Logo URL</label>
                <input type="url" className={inputCls} placeholder="https://example.com/school-logo.png" value={settingsLogoImage} onChange={(e) => setSettingsLogoImage(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
            <Image size={18} className="text-accent" /><h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Hero Background Images</h3>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
              Add background images for the home page hero carousel. Images auto-rotate every 5 seconds. Add at least 2-3 for a good effect.
            </p>

            {/* Current hero images */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
              {heroImages.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600 gap-2">
                  <Image size={32} className="opacity-40" />
                  <span className="text-xs font-bold uppercase tracking-wider">No hero images yet</span>
                  <span className="text-[10px]">Add images below to create a carousel slideshow</span>
                </div>
              )}
              {heroImages.map((img, idx) => (
                <div key={idx} className="group relative aspect-[16/9] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm">
                  <img src={img} alt={`Hero slide ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <button type="button" disabled={idx === 0} data-tip="Move Up"
                      className="p-1.5 rounded bg-white/20 hover:bg-white/40 text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed outline-none"
                      onClick={() => { const arr = [...heroImages]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; setHeroImages(arr); }}>
                      <MoveUp size={14} />
                    </button>
                    <button type="button" disabled={idx === heroImages.length - 1} data-tip="Move Down"
                      className="p-1.5 rounded bg-white/20 hover:bg-white/40 text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed outline-none"
                      onClick={() => { const arr = [...heroImages]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; setHeroImages(arr); }}>
                      <MoveDown size={14} />
                    </button>
                    <button type="button" data-tip="Delete"
                      className="p-1.5 rounded bg-rose-500/60 hover:bg-rose-500 text-white cursor-pointer outline-none"
                      onClick={() => setHeroImages(prev => prev.filter((_, i) => i !== idx))}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-slate-950/60 text-white px-1.5 py-0.5 rounded">{idx + 1}</span>
                </div>
              ))}
            </div>

            {/* Add via URL */}
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">Add Image URL</label>
                <div className="flex gap-2">
                  <input type="url" className={inputCls} placeholder="https://example.com/hero-image.jpg" value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)} />
                  <button type="button"
                    className="py-2 px-4 rounded-lg font-bold text-xs bg-accent text-white hover:bg-accent-hover disabled:opacity-50 cursor-pointer outline-none shadow-sm flex items-center gap-1.5 shrink-0"
                    disabled={!newImageUrl.trim()}
                    onClick={() => { if (newImageUrl.trim()) { setHeroImages(prev => [...prev, newImageUrl.trim()]); setNewImageUrl(''); } }}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Add via upload */}
            <div className="flex items-center gap-3">
              <label className="py-2 px-4 rounded-lg font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 outline-none border border-slate-200 dark:border-slate-700">
                <Upload size={12} /> {newImageFile ? 'Change File' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setNewImageFile(f);
                    setNewImagePreview(URL.createObjectURL(f));
                    setHeroUploading(true);
                    const url = await compressImage(f, 1920);
                    setHeroUploading(false);
                    if (url) {
                      setHeroImages(prev => [...prev, url]);
                      setNewImageFile(null);
                      setNewImagePreview('');
                    }
                  }
                }} />
              </label>
              {heroUploading && <span className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />}
              {newImagePreview && !heroUploading && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Adding...</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-805 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
            <Shield size={18} className="text-accent" /><h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white">Change Password</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Current Password</label>
                <input type="password" className={inputCls} value={pwdCurrent} onChange={(e) => { setPwdCurrent(e.target.value); setPwdError(''); setPwdSuccess(''); }} placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">New Password</label>
                <input type="password" className={inputCls} value={pwdNew} onChange={(e) => { setPwdNew(e.target.value); setPwdError(''); setPwdSuccess(''); }} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">Confirm New Password</label>
                <input type="password" className={inputCls} value={pwdConfirm} onChange={(e) => { setPwdConfirm(e.target.value); setPwdError(''); setPwdSuccess(''); }} placeholder="Re-enter new password" />
              </div>
            </div>
            {pwdError && <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40"><p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{pwdError}</p></div>}
            {pwdSuccess && <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40"><p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{pwdSuccess}</p></div>}
            <button type="button" disabled={pwdChanging}
              className="mt-4 py-2.5 px-6 rounded-xl font-bold text-xs bg-accent text-white hover:bg-accent-hover disabled:opacity-60 cursor-pointer outline-none shadow-md flex items-center gap-2"
              onClick={handleChangePassword}>
              {pwdChanging ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Updating...</> : <><Shield size={15} /> Update Password</>}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={settingsSaving}
            className="py-3 px-8 rounded-xl font-bold text-sm bg-accent text-white hover:bg-accent-hover disabled:opacity-60 cursor-pointer outline-none shadow-md flex items-center gap-2">
            {settingsSaving ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving...</> : <><CheckCircle size={16} /> Save All Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolSettings;
