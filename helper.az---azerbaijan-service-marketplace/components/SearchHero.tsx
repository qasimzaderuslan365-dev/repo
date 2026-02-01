
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
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          {t.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-10 opacity-90">
          {t.heroSubtitle}
        </p>

        <form 
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button 
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
          >
            {t.searchBtn}
          </button>
        </form>
      </div>
    </div>
  );
};
