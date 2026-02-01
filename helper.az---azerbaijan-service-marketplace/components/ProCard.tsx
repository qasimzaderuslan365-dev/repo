
import React from 'react';
import { Profile, Language } from '../types';
import { I18N } from '../constants';

interface Props {
  pro: Profile;
  language: Language;
  onSelect: (id: string) => void;
}

export const ProCard: React.FC<Props> = ({ pro, language, onSelect }) => {
  const t = I18N[language];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <img 
            src={pro.avatar} 
            alt={pro.name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-50"
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {pro.name}
            </h3>
            <div className="flex items-center gap-1 text-orange-500 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-sm">{pro.rating}</span>
              <span className="text-gray-400 text-xs">({pro.reviewsCount})</span>
            </div>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {pro.location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {pro.skills.map(skill => (
            <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-md uppercase tracking-wider">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">{t.hourlyRate}</p>
            <p className="text-xl font-bold text-gray-900">{pro.hourlyRate} <span className="text-sm font-medium">{t.azn}</span></p>
          </div>
          <button 
            onClick={() => onSelect(pro.id)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            {t.viewProfile}
          </button>
        </div>
      </div>
    </div>
  );
};
