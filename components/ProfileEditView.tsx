
import React, { useState } from 'react';
import { Profile, Language } from '../types';
import { I18N } from '../constants';
import { supabase } from '../lib/supabase';

interface Props {
  user: Profile;
  language: Language;
  onSave: (updatedUser: Profile) => void;
  onCancel: () => void;
}

export const ProfileEditView: React.FC<Props> = ({ user, language, onSave, onCancel }) => {
  const t = I18N[language];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user.name,
    avatar: user.avatar,
    bio: user.bio || '',
    profession: user.profession || '',
    hourlyRate: user.hourlyRate || 10,
    location: user.location || 'Bakı'
  });

  const isPro = user.role === 'PROFESSIONAL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updates = {
        name: formData.name,
        avatar_url: formData.avatar,
        bio: formData.bio,
        profession: formData.profession,
        hourly_rate: Number(formData.hourlyRate),
        location: formData.location,
        skills: formData.profession ? [formData.profession] : user.skills
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser: Profile = {
        ...user,
        ...updates,
        avatar: formData.avatar, // mapping avatar_url to avatar for local type
        hourlyRate: Number(formData.hourlyRate)
      };
      
      onSave(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Yeniləmə zamanı xəta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[40px] shadow-xl shadow-blue-50 border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.editProfile}</h2>
            <p className="text-gray-500 mt-2">Profil məlumatlarınızı güncəlləyərək daha çox müştəri cəlb edin.</p>
          </div>

          {success && (
            <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm">{t.successUpdate}</span>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <img 
                  src={formData.avatar} 
                  alt="Avatar Preview" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-50 shadow-md group-hover:opacity-75 transition-all"
                />
              </div>
              <div className="w-full mt-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.avatarLabel}</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.nameLabel}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                placeholder="Adınız və Soyadınız"
              />
            </div>

            {isPro && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.professionLabel}</label>
                    <input
                      type="text"
                      required
                      value={formData.profession}
                      onChange={(e) => setFormData({...formData, profession: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                      placeholder="Məs: Santexnik"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.hourlyRateLabel}</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      required
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: Number(e.target.value)})}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t.bioLabel}</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-sm leading-relaxed"
                    placeholder="Təcrübəniz və xidmətləriniz haqqında qısa məlumat..."
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Məkan</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
                placeholder="Məs: Bakı, Yasamal"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : t.saveChanges}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 border border-gray-100 hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
