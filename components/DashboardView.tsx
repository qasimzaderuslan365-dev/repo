
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-6">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-50"
              />
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.role === 'PROFESSIONAL' ? t.proRole : t.customerRole}</p>
              {isPro && user.profession && (
                <p className="mt-1 text-xs font-bold text-blue-600 uppercase tracking-tighter">{user.profession}</p>
              )}
            </div>

            {isPro && (
              <div className="space-y-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">{t.status}</span>
                  <button 
                    onClick={() => onToggleAvailability?.(!user.isAvailable)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">{language === 'az' ? 'Reytinq' : (language === 'en' ? 'Rating' : 'Рейтинг')}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-blue-800">{user.rating}</span>
                    <div className="flex text-orange-400">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className={`h-4 w-4 fill-current ${s > Math.floor(user.rating) ? 'opacity-30' : ''}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{language === 'az' ? 'Tarif' : (language === 'en' ? 'Rate' : 'Тариф')}</p>
                  <p className="text-xl font-black text-gray-900">{user.hourlyRate} {t.azn}/{language === 'en' ? 'hr' : (language === 'az' ? 'saat' : 'час')}</p>
                </div>
              </div>
            )}
            
            <div className="mt-8 space-y-2">
              <button 
                onClick={onEditProfile}
                className="w-full py-3 px-4 text-left text-sm font-bold rounded-xl bg-gray-50 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {t.editProfile}
              </button>
              <button className="w-full py-3 px-4 text-left text-sm font-semibold rounded-xl hover:bg-gray-50 text-gray-700">{t.security}</button>
            </div>
          </div>
        </div>

        {/* Right: Activity Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {isPro ? t.incomingOffers : t.myRequests}
            </h3>
            
            <div className="space-y-4">
              {offers.length > 0 ? (
                offers.map(offer => (
                  <div key={offer.id} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          offer.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {offer.status}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{offer.date} • {offer.time}</span>
                      </div>
                      <h4 className="font-bold text-gray-900">{isPro ? (t.customerRole + ': ' + offer.customerId) : offer.professionalName} — {offer.serviceType}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{offer.description}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end justify-between">
                       <p className="text-xl font-black text-blue-600">{offer.price} {t.azn}</p>
                       <div className="flex gap-2">
                         {isPro && offer.status === 'PENDING' && (
                           <>
                             <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg">{t.accept}</button>
                             <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg">{t.decline}</button>
                           </>
                         )}
                         <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg">{t.details}</button>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                   <p className="text-gray-400 italic">{t.noActivity}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
