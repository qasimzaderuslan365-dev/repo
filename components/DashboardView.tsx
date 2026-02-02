
import React, { useState } from 'react';
import { Profile, Language, Offer, OfferStatus } from '../types';
import { I18N } from '../constants';

interface Props {
  user: Profile;
  language: Language;
  offers: Offer[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onUpdateOfferStatus: (offerId: string, status: OfferStatus) => void;
  onToggleAvailability?: (available: boolean) => void;
  onEditProfile?: () => void;
  onStartPayment?: (offer: Offer) => void;
}

export const DashboardView: React.FC<Props> = ({ 
  user, 
  language, 
  offers, 
  isRefreshing, 
  onRefresh, 
  onUpdateOfferStatus,
  onToggleAvailability, 
  onEditProfile,
  onStartPayment
}) => {
  const t = I18N[language];
  const isPro = user.role === 'PROFESSIONAL';
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [activeTab, setActiveTab] = useState<'OFFERS' | 'SECURITY'>('OFFERS');

  const stats = isPro ? [
    { label: t.activeJobs, value: offers.filter(o => ['ACCEPTED', 'PENDING', 'PAID'].includes(o.status)).length },
    { label: t.completedJobs, value: offers.filter(o => o.status === 'COMPLETED').length },
    { label: t.profileViews, value: '128' }
  ] : [
    { label: t.myRequests, value: offers.length },
    { label: t.completedJobs, value: offers.filter(o => o.status === 'COMPLETED').length },
    { label: 'Təsdiqlənmə', value: user.isVerified ? 'Bəli' : 'Xeyr' }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white animate-pulse">{t.pending}</span>;
      case 'ACCEPTED': return <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white">{t.accepted}</span>;
      case 'PAID': return <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-indigo-600 text-white">{t.paid}</span>;
      case 'DECLINED': return <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-600 text-white">{t.declined}</span>;
      case 'COMPLETED': return <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-green-600 text-white">{t.completed}</span>;
      default: return <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gray-500 text-white">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
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
                {user.isVerified && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
              <div className="mt-1 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                {isPro ? t.proRole : t.customerRole}
              </div>
            </div>

            <div className="mt-8 space-y-2">
               <button 
                 onClick={() => setActiveTab('OFFERS')}
                 className={`w-full py-3 px-6 text-xs font-black rounded-2xl transition-all flex items-center gap-3 ${activeTab === 'OFFERS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                 {isPro ? t.incomingOffers : t.myRequests}
               </button>
               <button 
                 onClick={() => setActiveTab('SECURITY')}
                 className={`w-full py-3 px-6 text-xs font-black rounded-2xl transition-all flex items-center gap-3 ${activeTab === 'SECURITY' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 {t.security}
               </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-3">
              <button 
                onClick={onEditProfile}
                className="w-full py-4 px-6 text-sm font-black rounded-2xl bg-gray-900 text-white hover:bg-black transition-all shadow-lg active:scale-95"
              >
                {t.editProfile}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-gray-900">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'OFFERS' ? (
            <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  {isPro ? t.incomingOffers : t.myRequests}
                </h3>
                <button 
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 text-xs font-black rounded-xl uppercase tracking-widest"
                >
                  {isRefreshing ? <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                  {t.refresh}
                </button>
              </div>
              
              <div className="p-6">
                {offers.length > 0 ? (
                  <div className="space-y-4">
                    {offers.map(offer => (
                      <div key={offer.id} className="p-8 rounded-[32px] bg-gray-50/50 border border-transparent hover:border-blue-100 hover:bg-white transition-all flex flex-col md:flex-row justify-between gap-6 group">
                        <div className="flex gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                            offer.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                            offer.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                               {getStatusBadge(offer.status)}
                               <span className="text-[11px] font-bold text-gray-400">{offer.date} • {offer.time}</span>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 mb-2">{offer.service_type}</h4>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-lg line-clamp-2">{offer.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between shrink-0">
                           <div className="text-3xl font-black text-blue-600">{offer.price} <span className="text-sm">{t.azn}</span></div>
                           <div className="flex gap-2">
                             {isPro && offer.status === 'PENDING' && (
                               <button onClick={() => onUpdateOfferStatus(offer.id, 'ACCEPTED')} className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-100">{t.accept}</button>
                             )}
                             {!isPro && offer.status === 'ACCEPTED' && (
                               <button onClick={() => onStartPayment?.(offer)} className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-100">{t.pay}</button>
                             )}
                             <button onClick={() => setSelectedOffer(offer)} className="px-6 py-3 bg-white border border-gray-100 text-gray-900 text-xs font-black rounded-xl">{t.details}</button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center">
                     <p className="text-gray-400 font-bold italic">{t.noActivity}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 p-10">
               <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">{t.securityAudit}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[32px] border border-gray-100 bg-gray-50/50">
                     <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.isVerified ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Hesab Statusu</p>
                           <h4 className="font-black text-gray-900 text-lg">{user.isVerified ? t.verified : t.unverified}</h4>
                        </div>
                     </div>
                     <p className="text-sm text-gray-500 font-medium mb-4">Təhlükəsizlik reytinqi: <span className="text-blue-600 font-black">{user.isVerified ? '100%' : '35%'}</span></p>
                     {!user.isVerified && <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">İndi Təsdiqlə</button>}
                  </div>

                  <div className="p-8 rounded-[32px] border border-gray-100 bg-gray-50/50">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Son Giriş</p>
                           <h4 className="font-black text-gray-900 text-lg">İndi</h4>
                        </div>
                     </div>
                     <p className="text-xs text-gray-500">Məkan: Bakı, Azerbaijan (IP: 85.132.***.***)</p>
                     <p className="text-xs text-green-600 font-bold mt-2">Cihaz: Brauzer (Chrome)</p>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 mb-4 tracking-tight">Məxfilik Siyasəti və Şərtlər</h4>
                  <div className="flex flex-wrap gap-4">
                     <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Xidmət Şərtləri</a>
                     <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Məxfilik Siyasəti</a>
                     <a href="#" className="text-xs font-bold text-red-600 hover:underline">Hesabı Silmək</a>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t.details}</h2>
                  <div className="mt-1">{getStatusBadge(selectedOffer.status)}</div>
                </div>
                <button onClick={() => setSelectedOffer(null)} className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                   <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">{language === 'az' ? 'Xidmət növü' : 'Service Type'}</p>
                   <h3 className="text-xl font-black text-gray-900">{selectedOffer.service_type}</h3>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{t.locationLabel}</p>
                   <p className="font-bold text-gray-900 leading-relaxed">{selectedOffer.location}</p>
                </div>
                <div className="pt-6">
                   <button onClick={() => setSelectedOffer(null)} className="w-full py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">{language === 'az' ? 'Bağla' : 'Close'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
