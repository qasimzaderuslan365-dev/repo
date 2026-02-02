
import React, { useState } from 'react';
import { UserRole, Language } from '../types';
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
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
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
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (data.session) {
          onSuccess(data.user);
        } else if (data.user && !data.session) {
          setVerificationSent(true);
        } else {
          throw new Error("Gözlənilməz xəta baş verdi.");
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
        if (data.user) onSuccess(data.user);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Catching rate limit error specifically
      if (err.message?.toLowerCase().includes('rate limit')) {
        setError({ 
          message: language === 'az' 
            ? "E-poçt limiti aşıldı. Zəhmət olmasa bir az sonra yenidən yoxlayın və ya usta kimi əl ilə təsdiq üçün bizimlə əlaqə saxlayın." 
            : "Email rate limit exceeded. Please try again later or contact support for manual verification.",
          code: 'rate_limit'
        });
      } else {
        setError({ message: err.message || "Xəta baş verdi." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
        <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden p-10 text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{t.verifyEmailTitle}</h2>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">{t.verifyEmailDesc}</p>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            {t.home}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {mode === 'SIGNUP' ? t.authTitleSignup : t.authTitleLogin}
            </h2>
            <button onClick={onCancel} className="text-gray-300 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className={`mb-8 p-5 rounded-[28px] text-sm font-bold animate-shake leading-relaxed text-center border ${
              error.code === 'rate_limit' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              {error.message}
              {error.code === 'rate_limit' && (
                <div className="mt-3 text-[10px] text-amber-600/70 font-medium uppercase tracking-wider">
                  Developer Tip: Configure Custom SMTP in Supabase
                </div>
              )}
            </div>
          )}

          {mode === 'SIGNUP' && step === 1 ? (
            <div className="space-y-6">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] text-center mb-2">{t.selectAccountType}</p>
              <div className="grid grid-cols-2 gap-5">
                <button
                  onClick={() => { setRole('CUSTOMER'); setStep(2); }}
                  className="p-8 bg-gray-50 border-2 border-transparent rounded-[32px] hover:border-blue-600 hover:bg-white transition-all text-center group active:scale-95"
                >
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-black text-gray-900 text-sm tracking-tight">{t.customerRole}</span>
                </button>
                <button
                  onClick={() => { setRole('PROFESSIONAL'); setStep(2); }}
                  className="p-8 bg-gray-50 border-2 border-transparent rounded-[32px] hover:border-blue-600 hover:bg-white transition-all text-center group active:scale-95"
                >
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:-rotate-6 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="font-black text-gray-900 text-sm tracking-tight">{t.proRole}</span>
                </button>
              </div>
              <button 
                onClick={() => setMode('LOGIN')}
                className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors pt-4"
              >
                {t.hasAccount}
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-6">
              {mode === 'SIGNUP' && (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 rounded-[20px] border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-50 font-bold"
                    placeholder="Əli Məmmədov"
                  />
                </div>
              )}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-[20px] border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-50 font-bold"
                  placeholder="name@helper.az"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">{t.passwordLabel}</label>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-6 py-4 rounded-[20px] border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all disabled:opacity-50 font-bold"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-3xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
              >
                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {mode === 'SIGNUP' ? t.signupBtn : t.loginBtn}
              </button>
              
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'SIGNUP' ? 'LOGIN' : 'SIGNUP');
                    setStep(mode === 'SIGNUP' ? 2 : 1);
                  }}
                  className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  {mode === 'SIGNUP' ? t.hasAccount : t.noAccount}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
