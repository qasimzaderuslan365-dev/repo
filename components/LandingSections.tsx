
import React from 'react';
import { Language } from '../types';
import { I18N } from '../constants';

interface Props {
  language: Language;
}

export const LandingSections: React.FC<Props> = ({ language }) => {
  const t = I18N[language];

  return (
    <div className="space-y-32 py-24">
      {/* How it Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{t.howItWorks}</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">1</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{t.step1Title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{t.step1Desc}</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-blue-100 group-hover:-rotate-6 transition-transform">2</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{t.step2Title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{t.step2Desc}</p>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg shadow-blue-100 group-hover:rotate-6 transition-transform">3</div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{t.step3Title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{t.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="bg-gray-900 py-32 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">{t.whyUs}</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-black text-white mb-4">{t.whyUs1Title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{t.whyUs1Desc}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-black text-white mb-4">{t.whyUs2Title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{t.whyUs2Desc}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-xl font-black text-white mb-4">{t.whyUs3Title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{t.whyUs3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[48px] shadow-2xl shadow-blue-50 border border-gray-100 overflow-hidden">
          <div className="p-12 md:p-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{t.contactTitle}</h2>
              <p className="text-gray-500 font-medium">{t.contactSubtitle}</p>
            </div>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.nameLabel}</label>
                  <input type="text" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.emailLabel}</label>
                  <input type="email" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.messageLabel}</label>
                <textarea rows={4} className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium"></textarea>
              </div>
              <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs">{t.sendMessage}</button>
            </form>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-10 border-t border-gray-50 pt-10">
               <a href="https://wa.me/994000000000" className="flex items-center gap-3 text-gray-600 hover:text-green-600 font-black text-sm transition-colors">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                  WhatsApp
               </a>
               <a href="mailto:info@helper.az" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-black text-sm transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  info@helper.az
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
