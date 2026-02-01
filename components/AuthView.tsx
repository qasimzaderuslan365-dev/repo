
import React, { useState } from 'react';
import { UserRole, Language, Profile } from '../types';
import { I18N } from '../constants';
import { supabase } from '../lib/supabase';

interface Props {
  language: Language;
  onSuccess: (user: any) => void;
  onCancel: () => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
}

export const AuthView: React.FC<Props> = ({ language, onSuccess, onCancel, initialMode = 'LOGIN' }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  const [role, setRole] = useState<UserRole | null>(null);
  const [step, setStep] = useState<1 | 2>(mode === 'SIGNUP' ? 1 : 2);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const t = I18N[language];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase is not configured");

      if (mode === 'SIGNUP') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: role || 'CUSTOMER'
            },
            emailRedirectTo: window.location.origin
          }
        });

        if (signUpError) {
          // Detect Supabase Free Tier rate limits
          if (signUpError.message.toLowerCase().includes('rate limit') || 
              signUpError.message.toLowerCase().includes('email rate limit') ||
              signUpError.status === 429) {
            
            const rateLimitMsg = language === 'az' 
              ? 'Supabase (Free Tier) limiti keçildi. Zəhmət olmasa 1 saat gözləyin və ya başqa e-poçt ilə yoxlayın. Bu, təhlükəsizlik məqsədilə qoyulan məhdudiyyətdir.' 
              : (language === 'en' 
                  ? 'Supabase Free Tier rate limit exceeded. Please wait about 1 hour or try a different email/network. This is a security measure.' 
                  : 'Лимит Supabase исчерпан. Пожалуйста, подождите около часа или используйте другую почту.');
            
            throw new Error(rateLimitMsg);
          }
          throw signUpError;
        }
        
        setVerificationSent(true);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          if (signInError.message.toLowerCase().includes('rate limit') || signInError.status === 429) {
            throw new Error(
              language === 'az' 
                ? 'Giriş limiti keçildi. Bir az sonra yenidən cəhd edin.' 
                : 'Login rate limit exceeded. Please try again shortly.'
            );
          }
          throw signInError;
        }

        if (data.user) onSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-10 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.verifyEmailTitle}</h2>
          <p className="text-gray-500 leading-relaxed mb-8">{t.verifyEmailDesc}</p>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
          >
            {t.home}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'SIGNUP' ? t.authTitleSignup : t.authTitleLogin}
            </h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-shake leading-relaxed">
              {error}
            </div>
          )}

          {mode === 'SIGNUP' && step === 1 ? (
            <div className="space-y-4">
              <p className="text-gray-500 mb-6 text-center">{t.selectAccountType}</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setRole('CUSTOMER'); setStep(2); }}
                  className="p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-900">{t.customerRole}</span>
                </button>
                <button
                  onClick={() => { setRole('PROFESSIONAL'); setStep(2); }}
                  className="p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                >
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-900">{t.proRole}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-5">
              {mode === 'SIGNUP' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50"
                    placeholder={language === 'en' ? 'e.g. Ali Mammadov' : 'Məsələn: Əli Məmmədov'}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50"
                  placeholder="name@helper.az"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t.passwordLabel}</label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {mode === 'SIGNUP' ? t.signupBtn : t.loginBtn}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              {mode === 'SIGNUP' ? t.hasAccount : t.noAccount}
              <button
                disabled={loading}
                onClick={() => {
                  setMode(mode === 'SIGNUP' ? 'LOGIN' : 'SIGNUP');
                  setStep(mode === 'SIGNUP' ? 2 : 1);
                }}
                className="ml-2 text-blue-600 font-bold hover:underline disabled:opacity-50"
              >
                {mode === 'SIGNUP' ? t.login : t.authTitleSignup}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
