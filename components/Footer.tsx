
import React from 'react';
import { Language } from '../types';
import { I18N } from '../constants';

interface Props {
  language: Language;
  onNavigate: (view: any) => void;
}

export const Footer: React.FC<Props> = ({ language, onNavigate }) => {
  const t = I18N[language];

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 w-10 h-10 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-200">H</div>
              <span className="ml-3 text-2xl font-black tracking-tight text-gray-900">Helper<span className="text-blue-600">.az</span></span>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed max-w-sm mb-8">
              {t.footerAbout}
            </p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer transition-colors border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </div>
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-pink-600 cursor-pointer transition-colors border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.416.064-2.748.333-3.841 1.425-1.091 1.092-1.36 2.224-1.424 3.64-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.064 1.416.332 2.748 1.425 3.841 1.091 1.091 2.224 1.36 3.64 1.424 1.279.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.416-.064 2.748-.332 3.841-1.424 1.091-1.091 1.36-2.224 1.424-3.64.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.064-1.416-.332-2.748-1.424-3.841-1.092-1.091-2.224-1.36-3.64-1.424-1.28-.058-1.688-.072-4.947-.072z"/></svg>
               </div>
            </div>
          </div>
          <div>
            <h4 className="text-gray-900 font-black uppercase tracking-widest text-[10px] mb-8">{t.home}</h4>
            <ul className="space-y-4">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-gray-500 font-bold hover:text-blue-600 transition-colors text-sm">{t.home}</button></li>
              <li><a href="#how-it-works" className="text-gray-500 font-bold hover:text-blue-600 transition-colors text-sm">{t.howItWorks}</a></li>
              <li><a href="#why-us" className="text-gray-500 font-bold hover:text-blue-600 transition-colors text-sm">{t.whyUs}</a></li>
              <li><a href="#contact" className="text-gray-500 font-bold hover:text-blue-600 transition-colors text-sm">{t.contact}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-black uppercase tracking-widest text-[10px] mb-8">{t.security}</h4>
            <ul className="space-y-4">
              <li><span className="text-gray-500 font-bold text-sm">Xidmət Şərtləri</span></li>
              <li><span className="text-gray-500 font-bold text-sm">Məxfilik Siyasəti</span></li>
              <li><span className="text-gray-500 font-bold text-sm">Cookie Siyasəti</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 font-bold text-xs">© 2025 Helper.az. {t.rights}</p>
          <div className="flex gap-6 grayscale opacity-40">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};
