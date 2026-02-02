
import React, { useState, useRef } from 'react';
import { Profile, Language } from '../types';
import { I18N, PROFESSION_OPTIONS } from '../constants';
import { supabase } from '../lib/supabase';

interface Props {
  user: Profile;
  language: Language;
  onComplete: (updatedUser: Profile) => void;
}

export const OnboardingView: React.FC<Props> = ({ user, language, onComplete }) => {
  const t = I18N[language];
  const proOptions = PROFESSION_OPTIONS[language];
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    avatar: user.avatar && !user.avatar.includes('ui-avatars') ? user.avatar : '',
    bio: user.bio || '',
    profession: user.profession || '',
    customProfession: '',
    hourlyRate: user.hourlyRate || 15,
    location: user.location || 'Bakı'
  });

  const isPro = user.role === 'PROFESSIONAL';
  const otherLabel = language === 'az' ? 'Digər' : language === 'ru' ? 'Другое' : 'Other';
  const showCustomProfession = formData.profession === otherLabel;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError(language === 'az' ? 'Şəkil çox böyükdür (maks 2MB)' : 'Photo is too large (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinish = async () => {
    if (isPro) {
      if (!formData.avatar || formData.avatar.includes('ui-avatars')) {
        setError(t.photoRequired);
        return;
      }
      if (!formData.profession) {
        setError(language === 'az' ? 'Zəhmət olmasa peşənizi seçin.' : 'Please select your profession.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase is not configured");

      const finalProfession = showCustomProfession ? formData.customProfession : formData.profession;

      const updates = {
        avatar_url: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
        bio: formData.bio,
        profession: isPro ? finalProfession : null,
        hourly_rate: isPro ? Number(formData.hourlyRate) : 15,
        location: formData.location,
        onboarding_completed: true,
        skills: isPro && finalProfession ? [finalProfession] : []
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      onComplete({
        ...user,
        ...updates,
        avatar: updates.avatar_url,
        hourlyRate: updates.hourly_rate,
        onboarding_completed: true,
        profession: updates.profession || user.profession
      });
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="absolute top-10 flex items-center">
        <div className="bg-blue-600 w-8 h-8 rounded-lg text-white font-black text-lg flex items-center justify-center shadow-lg">H</div>
        <span className="ml-2 text-xl font-black text-gray-900 tracking-tight">Helper.az</span>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[48px] shadow-2xl shadow-blue-50 border border-gray-100 p-8 sm:p-14 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="mb-12 text-center">
          <div className="flex justify-center gap-3 mb-8">
            <div className={`h-1.5 w-16 rounded-full transition-all duration-700 ${step >= 1 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
            <div className={`h-1.5 w-16 rounded-full transition-all duration-700 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-100'}`}></div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
            {step === 1 ? t.onboardingStep1 : t.onboardingStep2}
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            {isPro 
              ? (language === 'en' ? "Let's set up your business profile." : "Biznes profilinizi quraşdıraq.")
              : (language === 'en' ? "Finish your profile to start using the platform." : "Profilinizi tamamlayın və platformadan istifadəyə başlayın.")
            }
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-black animate-shake text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-center">
            <div className="flex flex-col items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="w-44 h-44 rounded-[56px] overflow-hidden border-[10px] border-blue-50/50 bg-gray-50 shadow-2xl transition-all group-hover:scale-105 group-hover:rotate-2 flex items-center justify-center">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-10 px-8 py-3 bg-gray-50 text-gray-900 font-black rounded-2xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest border border-gray-100"
              >
                {t.uploadPhoto}
              </button>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
            >
              {t.next}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
            {isPro && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.professionLabel}</label>
                    <select
                      className="w-full px-7 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                      value={formData.profession}
                      onChange={(e) => setFormData({...formData, profession: e.target.value})}
                    >
                      <option value="">{language === 'az' ? 'Seçin...' : 'Select...'}</option>
                      {proOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.hourlyRateLabel}</label>
                    <div className="relative">
                      <input 
                        type="number"
                        min="10"
                        max="100"
                        className="w-full px-7 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-sm"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                      />
                      <span className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs">AZN</span>
                    </div>
                  </div>
                </div>

                {showCustomProfession && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">{language === 'az' ? 'Öz peşənizi qeyd edin' : 'Specify your profession'}</label>
                    <input 
                      type="text"
                      placeholder="e.g. Laminat ustası"
                      className="w-full px-7 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-sm"
                      value={formData.customProfession}
                      onChange={(e) => setFormData({...formData, customProfession: e.target.value})}
                    />
                  </div>
                )}
              </>
            )}

            {/* Bio is now for everyone */}
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.bioLabel}</label>
              <textarea 
                rows={4}
                placeholder={t.bioMinLength}
                className="w-full px-7 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium leading-relaxed text-sm"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.cityLabel}</label>
              <input 
                type="text"
                placeholder="Bakı, Sumqayıt, Gəncə..."
                className="w-full px-7 py-5 rounded-3xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-400 outline-none transition-all font-bold text-sm"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="flex gap-5 pt-8">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-6 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all text-sm uppercase tracking-widest"
              >
                {language === 'en' ? 'Back' : 'Geri'}
              </button>
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="flex-[2] py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
              >
                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {t.completeOnboarding}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
