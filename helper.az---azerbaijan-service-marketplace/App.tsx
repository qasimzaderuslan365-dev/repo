
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PROFILES, I18N } from './constants';
import { Profile, Offer, Language, UserRole } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { SearchHero } from './components/SearchHero';
import { ProCard } from './components/ProCard';
import { BookingModal } from './components/BookingModal';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { getIntelligentServiceMatch } from './services/geminiService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('az');
  const [pros, setPros] = useState<Profile[]>(MOCK_PROFILES);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [view, setView] = useState<'HOME' | 'DASHBOARD' | 'AUTH'>('HOME');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const t = I18N[language];

  const handleSearch = async (query: string) => {
    if (!query) {
      setPros(MOCK_PROFILES);
      return;
    }
    
    setIsSearching(true);
    const match = await getIntelligentServiceMatch(query);
    const keywords = [match.primaryCategory, ...match.keywords].map(k => k.toLowerCase());
    
    const filtered = MOCK_PROFILES.filter(pro => 
      pro.skills.some(skill => keywords.some(k => skill.toLowerCase().includes(k))) ||
      keywords.some(k => pro.name.toLowerCase().includes(k)) ||
      keywords.some(k => pro.bio.toLowerCase().includes(k))
    );
    
    setPros(filtered);
    setIsSearching(false);
  };

  const selectedPro = useMemo(() => 
    pros.find(p => p.id === selectedProId) || null
  , [selectedProId, pros]);

  const handleBooking = (details: { desc: string; date: string; time: string; location: string }) => {
    if (!currentUser) {
      setAuthMode('LOGIN');
      setView('AUTH');
      return;
    }

    if (!selectedPro) return;

    const newOffer: Offer = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: currentUser.name,
      professionalId: selectedPro.id,
      professionalName: selectedPro.name,
      serviceType: selectedPro.skills[0],
      description: details.desc,
      price: selectedPro.hourlyRate,
      date: details.date,
      time: details.time,
      status: 'PENDING',
      location: details.location
    };

    setOffers(prev => [newOffer, ...prev]);
    setSelectedProId(null);
    alert('Təklifiniz uğurla göndərildi!');
    setView('DASHBOARD');
  };

  const handleAuthSuccess = (user: Profile) => {
    setCurrentUser(user);
    setView('HOME');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('HOME');
  };

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-10">
              <div 
                className="flex items-center cursor-pointer group" 
                onClick={() => setView('HOME')}
              >
                <div className="bg-blue-600 p-2.5 rounded-xl text-white font-black text-xl shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">H</div>
                <span className="ml-3 text-2xl font-bold tracking-tight text-gray-900">Helper<span className="text-blue-600">.az</span></span>
              </div>
              
              <div className="hidden lg:flex gap-8">
                <button 
                  onClick={() => setView('HOME')}
                  className={`text-sm font-bold transition-colors ${view === 'HOME' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {t.home}
                </button>
                {currentUser && (
                  <button 
                    onClick={() => setView('DASHBOARD')}
                    className={`text-sm font-bold transition-colors ${view === 'DASHBOARD' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Panel
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <LanguageSelector current={language} onChange={setLanguage} />
              
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{currentUser.role}</p>
                  </div>
                  <button 
                    onClick={() => setView('DASHBOARD')}
                    className="w-10 h-10 rounded-full border-2 border-blue-50 overflow-hidden hover:ring-2 hover:ring-blue-100 transition-all"
                  >
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setAuthMode('LOGIN'); setView('AUTH'); }}
                    className="text-sm font-bold text-gray-600 hover:text-gray-900 px-4 py-2"
                  >
                    {t.login}
                  </button>
                  <button 
                    onClick={() => { setAuthMode('SIGNUP'); setView('AUTH'); }}
                    className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                  >
                    {t.becomePro}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-500">
        {view === 'HOME' && (
          <>
            <SearchHero language={language} onSearch={handleSearch} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.popularCategories}</h2>
                  <p className="text-gray-500 mt-2 font-medium">Bakı və regionlar üzrə təcrübəli ustalar.</p>
                </div>
                {isSearching && (
                  <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl text-blue-600 text-sm font-bold animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Gemini ağıllı axtarış edir...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pros.length > 0 ? (
                  pros.map(pro => (
                    <ProCard 
                      key={pro.id} 
                      pro={pro} 
                      language={language} 
                      onSelect={(id) => setSelectedProId(id)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                    <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Usta tapılmadı</h3>
                    <p className="text-gray-500 mt-2">Axtarış sözünü dəyişməyə və ya başqa kateqoriyaya baxmağa çalışın.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {view === 'DASHBOARD' && currentUser && (
          <DashboardView 
            user={currentUser} 
            language={language} 
            offers={offers} 
            onToggleAvailability={(val) => setCurrentUser({...currentUser, isAvailable: val})}
          />
        )}

        {view === 'AUTH' && (
          <AuthView 
            language={language} 
            initialMode={authMode}
            onSuccess={handleAuthSuccess}
            onCancel={() => setView('HOME')}
          />
        )}
      </main>

      {/* Mobile Footer Navigation */}
      <footer className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t py-4 px-8 flex justify-between items-center z-40">
         <button 
           onClick={() => setView('HOME')}
           className={`flex flex-col items-center gap-1.5 transition-colors ${view === 'HOME' ? 'text-blue-600' : 'text-gray-400'}`}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
           </svg>
           <span className="text-[10px] font-bold uppercase tracking-wider">{t.home}</span>
         </button>
         
         <button 
           onClick={() => currentUser ? setView('DASHBOARD') : setView('AUTH')}
           className={`flex flex-col items-center gap-1.5 transition-colors ${view === 'DASHBOARD' ? 'text-blue-600' : 'text-gray-400'}`}
         >
           <div className="relative">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
             {offers.length > 0 && (
               <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white font-bold">{offers.length}</span>
             )}
           </div>
           <span className="text-[10px] font-bold uppercase tracking-wider">Panel</span>
         </button>

         <button 
           onClick={() => currentUser ? setView('DASHBOARD') : setView('AUTH')}
           className={`flex flex-col items-center gap-1.5 transition-colors ${view === 'AUTH' ? 'text-blue-600' : 'text-gray-400'}`}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
           <span className="text-[10px] font-bold uppercase tracking-wider">Profil</span>
         </button>
      </footer>

      <BookingModal 
        pro={selectedPro}
        language={language}
        onClose={() => setSelectedProId(null)}
        onSubmit={handleBooking}
      />
    </div>
  );
};

export default App;
