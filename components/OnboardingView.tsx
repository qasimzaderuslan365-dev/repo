
import React, { useState } from 'react';
import { Profile, Language } from '../types';
import { I18N } from '../constants';
import { supabase } from '../lib/supabase';

interface Props {
  user: Profile;
  language: Language;
  onComplete: (updatedUser: Profile) => void;
}

export const OnboardingView: React.FC<Props> = ({ user, language, onComplete }) => {
  const t = I18N[language];
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    avatar: user.avatar || '',
    bio: user.bio || '',
    profession: user.profession || '',
    hourlyRate: user.hourlyRate || 15,
    location: user.location || 'Bakı'
  });

  const isPro = user.role === 'PROFESSIONAL';

  const handleFinish = async () => {
    if (isPro) {
      if (!formData.avatar || formData.avatar.includes('ui-avatars')) {
        setError(t.photoRequired);
        return;
      }
      if (formData.bio.length < 50) {
        setError(t.bioMinLength);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase is not configured");

      const updates = {
        avatar_url: formData.avatar,
        bio: formData.bio,
        profession: formData.profession,
        hourly_rate: Number(formData.hourlyRate),
        location: formData.location,
        onboarding_completed: true,
        skills: formData.profession ? [formData.profession] : []
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      onComplete({
        ...user,
        ...updates,
        avatar: formData.avatar,
        hourlyRate: Number(formData.hourlyRate),
        onboarding_completed: true
      });
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Step {step} of 2
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{t.onboardingTitle}</h1>
          <p className="text-gray-500 font-medium">
            {isPro 
              ? (language === 'en' ? "Let's make you look professional to attract customers." : "Müştəriləri cəlb etmək üçün profilinizi professional edin.")
              : (language === 'en' ? "Just a few details to get you started." : "Başlamaq üçün bir neçə məlumat kifayətdir.")
            }
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <img 
                  src={formData.avatar} 
                  alt="Avatar" 
                  className="w-48 h-48 rounded-[48px] object-cover border-8 border-blue-50 shadow-2xl transition-all group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                </div>
              </div>
              <div className="w-full mt-8">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.avatarLabel}</label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                />
                <p className="text-[10px] text-gray-400 mt-2 italic">* {language === 'en' ? "For now, please provide a direct image URL." : "Hələlik, zəhmət olmasa birbaşa şəkil linki daxil edin."}</p>
              </div>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
            >
              {t.next}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.professionLabel}</label>
                <input 
                  type="text"
                  placeholder="e.g. Plumber"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.hourlyRateLabel}</label>
                <input 
                  type="number"
                  min="10"
                  max="100"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.bioLabel}</label>
              <textarea 
                rows={4}
                placeholder={t.bioMinLength}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium leading-relaxed"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.cityLabel}</label>
              <input 
                type="text"
                placeholder="Bakı, Sumqayıt, Gəncə..."
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all"
              >
                {language === 'en' ? 'Back' : 'Geri'}
              </button>
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
