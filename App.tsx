
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_PROFILES, I18N } from './constants';
import { Profile, Offer, Language } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { SearchHero } from './components/SearchHero';
import { ProCard } from './components/ProCard';
import { BookingModal } from './components/BookingModal';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { ProfileEditView } from './components/ProfileEditView';
import { OnboardingView } from './components/OnboardingView';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { getIntelligentServiceMatch } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('az');
  const [pros, setPros] = useState<Profile[]>(MOCK_PROFILES);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [view, setView] = useState<'HOME' | 'DASHBOARD' | 'AUTH' | 'PROFILE_EDIT' | 'ONBOARDING'>('HOME');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const t = I18N[language];

  const mapProfile = (data: any): Profile => ({
    ...data,
    hourlyRate: data.hourly_rate,
    reviewsCount: data.reviews_count,
    avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`,
    joinedDate: data.joined_date,
    onboarding_completed: data.onboarding_completed
  });

  // Initial Session & Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setInitialized(true);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          await fetchAndSetProfile(session.user.id);
        }
      } catch (e) {
        console.error("Session init failed", e);
      } finally {
        setInitialized(true);
      }
    };

    initSession();

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchAndSetProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setView('HOME');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // STRICT ONBOARDING ENFORCEMENT
  useEffect(() => {
    if (initialized && currentUser && !currentUser.onboarding_completed) {
      if (view !== 'ONBOARDING') setView('ONBOARDING');
    }
  }, [currentUser, view, initialized]);

  // Fetch Pros and Offers
  useEffect(() => {
    if (!initialized || !isSupabaseConfigured || !supabase) return;

    const fetchMarketplaceData = async () => {
      try {
        // Fetch Professionals
        const { data: prosData, error: prosError } = await supabase!
          .from('profiles')
          .select('*')
          .eq('role', 'PROFESSIONAL')
          .eq('onboarding_completed', true);
        
        if (prosError) {
          if (prosError.code === '42P01') setDbError("Database tables not found. Run SQL script.");
          throw prosError;
        }

        if (prosData) {
          const mappedPros = prosData.map(mapProfile);
          setPros(mappedPros.length > 0 ? mappedPros : MOCK_PROFILES);
          setDbError(null);
        }

        // Fetch User's Offers if logged in
        if (currentUser) {
          const { data: offersData } = await supabase!
            .from('offers')
            .select('*')
            .or(`customer_id.eq.${currentUser.id},professional_id.eq.${currentUser.id}`)
            .order('created_at', { ascending: false });
          
          if (offersData) setOffers(offersData);
        }
      } catch (e) {
        console.error("Marketplace fetch failed", e);
      }
    };

    fetchMarketplaceData();
  }, [initialized, currentUser?.id]);

  const fetchAndSetProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setCurrentUser(mapProfile(data));
      }
    } catch (e) {
      console.error("Fetch profile failed", e);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    try {
      const match = await getIntelligentServiceMatch(query);
      const keywords = [match.primaryCategory, ...match.keywords].map(k => k.toLowerCase());
      
      const filtered = pros.filter(pro => 
        (pro.profession && keywords.some(k => pro.profession!.toLowerCase().includes(k))) ||
        pro.skills.some(skill => keywords.some(k => skill.toLowerCase().includes(k))) ||
        keywords.some(k => pro.name.toLowerCase().includes(k)) ||
        keywords.some(k => pro.bio.toLowerCase().includes(k))
      );
      setPros(filtered);
    } catch (e) {
      console.error("Search failed", e);
    }
    setIsSearching(false);
  };

  const selectedPro = useMemo(() => 
    pros.find(p => p.id === selectedProId) || null
  , [selectedProId, pros]);

  const handleBooking = async (details: { desc: string; date: string; time: string; location: string }) => {
    if (!currentUser) { setAuthMode('LOGIN'); setView('AUTH'); return; }
    if (!selectedPro) return;

    if (!isSupabaseConfigured || !supabase) {
      alert("Supabase not configured.");
      return;
    }

    const { error } = await supabase.from('offers').insert({
      customer_id: currentUser.id,
      professional_id: selectedPro.id,
      service_type: selectedPro.skills[0] || selectedPro.profession || 'Service',
      description: details.desc,
      price: selectedPro.hourlyRate,
      date: details.date,
      time: details.time,
      location: details.location,
      status: 'PENDING'
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert('Sifariş uğurla göndərildi!');
    setSelectedProId(null);
    setView('DASHBOARD');
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
    setView('HOME');
  };

  if (!initialized) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-gray-400 text-sm tracking-widest uppercase animate-pulse">Helper.az Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC] selection:bg-blue-100">
      {dbError && (
        <div className="bg-red-600 text-white text-center py-3 px-4 text-sm font-bold animate-pulse sticky top-0 z-[100] shadow-lg">
          ⚠️ {dbError}
        </div>
      )}

      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-10">
              <div className="flex items-center cursor-pointer group" onClick={() => setView('HOME')}>
                <div className="bg-blue-600 w-10 h-10 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">H</div>
                <span className="ml-3 text-2xl font-black tracking-tight text-gray-900">Helper<span className="text-blue-600">.az</span></span>
              </div>
              <div className="hidden lg:flex gap-8">
                <button onClick={() => setView('HOME')} className={`text-sm font-bold transition-colors ${view === 'HOME' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>{t.home}</button>
                {currentUser && <button onClick={() => setView('DASHBOARD')} className={`text-sm font-bold transition-colors ${view === 'DASHBOARD' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>{t.panel}</button>}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <LanguageSelector current={language} onChange={setLanguage} />
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-black text-gray-900">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{currentUser.role === 'PROFESSIONAL' ? t.proRole : t.customerRole}</p>
                  </div>
                  <button onClick={() => setView('DASHBOARD')} className="w-11 h-11 rounded-2xl border-2 border-gray-50 p-0.5 overflow-hidden ring-2 ring-transparent hover:ring-blue-100 transition-all">
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[14px]" />
                  </button>
                  <button onClick={handleLogout} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => { setAuthMode('LOGIN'); setView('AUTH'); }} className="text-sm font-bold text-gray-600 hover:text-gray-900 px-4 py-2">{t.login}</button>
                  <button onClick={() => { setAuthMode('SIGNUP'); setView('AUTH'); }} className="bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">{t.becomePro}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-700">
        {view === 'HOME' && (
          <>
            <SearchHero language={language} onSearch={handleSearch} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t.popularCategories}</h2>
                  <p className="text-gray-500 mt-2 font-medium">{language === 'en' ? 'Verified experts available for immediate hire.' : 'Yoxlanılmış mütəxəssislər xidmətinizdədir.'}</p>
                </div>
                {isSearching && (
                  <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-2xl text-blue-600 text-sm font-bold animate-pulse border border-blue-100">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    {t.geminiSearching}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {pros.length > 0 ? pros.map(pro => (
                  <ProCard key={pro.id} pro={pro} language={language} onSelect={(id) => setSelectedProId(id)} />
                )) : (
                  <div className="col-span-full py-32 text-center bg-white rounded-[48px] border-2 border-dashed border-gray-100">
                    <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">{t.noProsFound}</h3>
                    <p className="text-gray-500 mt-2 font-medium">{t.noProsFoundSub}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {view === 'DASHBOARD' && currentUser && (
          <DashboardView user={currentUser} language={language} offers={offers} onToggleAvailability={(val) => setCurrentUser({...currentUser, isAvailable: val})} onEditProfile={() => setView('PROFILE_EDIT')} />
        )}

        {view === 'PROFILE_EDIT' && currentUser && (
          <ProfileEditView user={currentUser} language={language} onSave={(updated) => { setCurrentUser(updated); setView('DASHBOARD'); }} onCancel={() => setView('DASHBOARD')} />
        )}

        {view === 'ONBOARDING' && currentUser && (
          <OnboardingView user={currentUser} language={language} onComplete={(updated) => { setCurrentUser(updated); setView('DASHBOARD'); }} />
        )}

        {view === 'AUTH' && (
          <AuthView language={language} initialMode={authMode} onSuccess={() => setView('HOME')} onCancel={() => setView('HOME')} />
        )}
      </main>

      <BookingModal pro={selectedPro} language={language} onClose={() => setSelectedProId(null)} onSubmit={handleBooking} />
      {showConfigModal && <SupabaseConfigModal onClose={() => setShowConfigModal(false)} />}
    </div>
  );
};

export default App;
