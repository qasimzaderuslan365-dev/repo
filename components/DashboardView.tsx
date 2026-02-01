
import React from 'react';
import { Profile, Language, Offer } from '../types';
import { I18N } from '../constants';

interface Props {
  user: Profile;
  language: Language;
  offers: Offer[];
  onToggleAvailability?: (available: boolean) => void;
  onEditProfile?: () => void;
}

export const DashboardView: React.FC<Props> = ({ user, language, offers, onToggleAvailability, onEditProfile }) => {
  const t = I18N[language];
  const isPro = user.role === 'PROFESSIONAL';

  const stats = isPro ? [
    { label: t.activeJobs, value: offers.filter(o => o.status === 'ACCEPTED').length, color: 'blue' },
    { label: t.completedJobs, value: offers.filter(o => o.status === 'COMPLETED').length, color: 'green' },
    { label: t.profileViews, value: '128', color: 'orange' }
  ] : [
    { label: t.myRequests, value: offers.length, color: 'blue' },
    { label: t.completedJobs, value: offers.filter(o => o.status === 'COMPLETED').length, color: 'green' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Left: Enhanced Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 sticky top-28">
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-28 h-28 rounded-[32px] mx-auto mb-4 object-cover border-4 border-white shadow-xl"
                />
                {isPro && (
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${user.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
              <div className="mt-1 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                {isPro ? t.proRole : t.customerRole}
              </div>
            </div>

            {isPro && (
              <div className="mt-8 space-y-4 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => onToggleAvailability?.(!user.isAvailable)}>
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{user.isAvailable ? t.availabilityText : t.notAvailableText}</span>
                   <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.isAvailable ? 'bg-blue-600' : 'bg-gray-200'}`}>
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
                
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{t.hourlyRate}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{user.hourlyRate}</span>
                    <span className="text-sm font-bold text-gray-400">{t.azn}/saat</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button 
                onClick={onEditProfile}
                className="w-full py-4 px-6 text-sm font-black rounded-2xl bg-gray-900 text-white hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
              >
                {t.editProfile}
              </button>
              <button className="w-full py-4 px-6 text-sm font-bold rounded-2xl border-2 border-gray-100 text-gray-500 hover:bg-gray-50 transition-all">
                {t.security}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Modern Main Content */}
        <div className="flex-1 space-y-8">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-gray-900">{stat.value}</span>
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-10 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {isPro ? t.incomingOffers : t.myRequests}
              </h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-50 text-gray-400 text-xs font-black rounded-xl uppercase tracking-widest hover:text-gray-900 transition-colors">Filter</button>
                <button className="px-4 py-2 bg-gray-50 text-gray-400 text-xs font-black rounded-xl uppercase tracking-widest hover:text-gray-900 transition-colors">Export</button>
              </div>
            </div>
            
            <div className="p-6">
              {offers.length > 0 ? (
                <div className="space-y-4">
                  {offers.map(offer => (
                    <div key={offer.id} className="p-8 rounded-[32px] bg-gray-50/50 border border-transparent hover:border-blue-100 hover:bg-white transition-all flex flex-col md:flex-row justify-between gap-6 group">
                      <div className="flex gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          offer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 
                          offer.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                               offer.status === 'PENDING' ? 'bg-yellow-500 text-white' : 
                               offer.status === 'ACCEPTED' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                             }`}>
                               {offer.status}
                             </span>
                             <span className="text-[11px] font-bold text-gray-400">{offer.date} • {offer.time}</span>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 mb-2">{offer.service_type}</h4>
                          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg">{offer.description}</p>
                          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-gray-400">
                             <div className="flex items-center gap-1.5">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                               {offer.location}
                             </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between shrink-0">
                         <div className="text-3xl font-black text-blue-600">{offer.price} <span className="text-sm">{t.azn}</span></div>
                         <div className="flex gap-2">
                           {isPro && offer.status === 'PENDING' && (
                             <button className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">{t.accept}</button>
                           )}
                           <button className="px-6 py-3 bg-white border border-gray-100 text-gray-900 text-xs font-black rounded-xl hover:bg-gray-50 transition-all">{t.details}</button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                   <p className="text-gray-400 font-bold italic">{t.noActivity}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
