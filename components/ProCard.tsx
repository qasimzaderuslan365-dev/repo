
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
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between">
          <div className="relative">
            <img 
              src={pro.avatar} 
              alt={pro.name} 
              className="w-20 h-20 rounded-[28px] object-cover border-4 border-gray-50 shadow-sm transition-transform group-hover:scale-105"
            />
            {pro.isAvailable && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            )}
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{t.hourlyRate}</p>
            <p className="text-xl font-black text-gray-900">{pro.hourlyRate} <span className="text-xs font-bold text-gray-400">{t.azn}</span></p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">
            {pro.name}
          </h3>
          <p className="text-sm font-bold text-blue-500 uppercase tracking-tighter mt-1">{pro.profession}</p>
          
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="font-black text-sm text-gray-900">{pro.rating}</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">({pro.reviewsCount} reviews)</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500 font-medium leading-relaxed line-clamp-3 flex-1">
          {pro.bio}
        </p>

        <div className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-50">
           <button 
             onClick={() => onSelect(pro.id)}
             className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-gray-200"
           >
             {t.viewProfile}
           </button>
           <button 
             onClick={() => onSelect(pro.id)}
             className="w-14 h-14 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             </svg>
           </button>
        </div>
      </div>
    </div>
  );
};
