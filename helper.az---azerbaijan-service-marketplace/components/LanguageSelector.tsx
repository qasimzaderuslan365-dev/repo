
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export const LanguageSelector: React.FC<Props> = ({ current, onChange }) => {
  return (
    <div className="flex space-x-2 text-sm font-medium">
      {(['az', 'en', 'ru'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-2 py-1 rounded transition-colors ${
            current === lang 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
