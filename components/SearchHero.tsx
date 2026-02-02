
import React, { useState } from 'react';
import { I18N } from '../constants';
import { Language } from '../types';

interface Props {
  language: Language;
  onSearch: (query: string) => void;
}

export const SearchHero: React.FC<Props> = ({ language, onSearch }) => {
  const [query, setQuery] = useState('');
  const t = I18N[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 py-32 px-4 overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center text-white relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          {t.safetyGuarantee}
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
          {t.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 font-medium opacity-90 max-w-2xl mx-auto">
          {t.heroSubtitle}
        </p>

        <form 
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto flex flex-col md:flex-row gap-4 p-3 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-2xl"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-8 py-5 rounded-2xl text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all font-bold text-lg"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-widest"
          >
            {t.searchBtn}
          </button>
        </form>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-10 opacity-50">
           <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              <span className="text-[11px] font-black uppercase tracking-widest">{t.verified} Ustalar</span>
           </div>
           <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="text-[11px] font-black uppercase tracking-widest">SSL Təhlükəsizlik</span>
           </div>
           <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="text-[11px] font-black uppercase tracking-widest">Sürətli Ödəniş</span>
           </div>
        </div>
      </div>
    </div>
  );
};
