
import React from 'react';
import { Language } from '../types';
import { I18N } from '../constants';

interface Props {
  language: Language;
  onContinue: () => void;
}

export const EmailVerifiedView: React.FC<Props> = ({ language, onContinue }) => {
  const t = I18N[language];

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative w-28 h-28 bg-green-500 text-white rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-green-200 group transform hover:rotate-6 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          {t.emailVerifiedTitle}
        </h1>
        <p className="text-gray-500 font-medium text-lg leading-relaxed mb-12 px-4">
          {t.emailVerifiedDesc}
        </p>
        
        <button 
          onClick={onContinue}
          className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          {t.goToLogin}
        </button>

        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="bg-blue-600 w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center">H</div>
          <span className="text-sm font-black text-gray-900 tracking-tight">Helper.az</span>
        </div>
      </div>
    </div>
  );
};
