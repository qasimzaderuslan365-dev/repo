
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MOCK_PROFILES, I18N } from './constants';
import { Profile, Offer, Language, OfferStatus } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { SearchHero } from './components/SearchHero';
import { ProCard } from './components/ProCard';
import { BookingModal } from './components/BookingModal';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { ProfileEditView } from './components/ProfileEditView';
import { OnboardingView } from './components/OnboardingView';
import { CheckoutView } from './components/CheckoutView';
import { EmailVerifiedView } from './components/EmailVerifiedView';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { LandingSections } from './components/LandingSections';
import { Footer } from './components/Footer';
import { getIntelligentServiceMatch } from './services/geminiService';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('az');
  const [pros, setPros] = useState<Profile[]>(MOCK_PROFILES);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedProId, setSelectedProId] = useState<string | null>(null);
  const [activeOfferForPayment, setActiveOfferForPayment] = useState<Offer | null>(null);
  const [view, setView] = useState<'HOME' | 'DASHBOARD' | 'PROFILE' | 'AUTH' | 'PROFILE_EDIT' | 'CHECKOUT' | 'VERIFIED'>('HOME');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const t = I18N[language];

  const mapProfile = useCallback((data: any): Profile => ({
    ...data,
    id: data.id,
    name: data.name || 'İstifadəçi',
    role: data.role || 'CUSTOMER',
    profession: data.profession || '',
    skills: data.skills || [],
    bio: data.bio || '',
    hourlyRate: data.hourly_rate || 15,
    rating: data.rating || 5.0,
    reviewsCount: data.reviews_count || 0,
    avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=0D8ABC&color=fff`,
    location: data.location || 'Bakı',
    joinedDate: data.joined_date,
    onboarding_completed: !!data.onboarding_completed,
    isAvailable: data.is_available ?? true,
    isVerified: !!data.is_verified
  }), []);

  const fetchAndSetProfile = useCallback(async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setCurrentUser(mapProfile(data));
      } else if (error && error.code === 'PGRST116') {
        console.warn("Profile not found for ID:", userId);
      }
    } catch (e) {
      console.error("Fetch profile failed", e);
    }
  }, [mapProfile]);

  // Auth Redirect & Initial Session Listener
  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      // 1. Detect if we just returned from an email confirmation link
      // Supabase often puts access_token in the hash
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) {
        if (isMounted) setView('VERIFIED');
      }

      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) setInitialized(true);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          await fetchAndSetProfile(session.user.id);
        }
      } catch (e) {
        console.error("Initialization check failed:", e);
      } finally {
        if (isMounted) setInitialized(true);
      }
    };

    init();

    const { data: { subscription } } = supabase 
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (!isMounted) return;
          if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
            await fetchAndSetProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setView('HOME');
          }
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAndSetProfile]);

  const fetchMarketplaceData = useCallback(async () => {
    if (!initialized || !isSupabaseConfigured || !supabase) return;
    
    setIsRefreshing(true);
    try {
      const { data: prosData, error: prosError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'PROFESSIONAL')
        .eq('onboarding_completed', true)
        .limit(20);
      
      if (prosError) {
        if (prosError.code === '42P01') setDbError("Bazalar quraşdırılmayıb. Zəhmət olmasa SQL skriptini icra edin.");
        throw prosError;
      }

      if (prosData && prosData.length > 0) {
        setPros(prosData.map(mapProfile));
        setDbError(null);
      } else {
        setPros(MOCK_PROFILES);
      }

      if (currentUser) {
        const { data: offersData } = await supabase
          .from('offers')
          .select('*')
          .or(`customer_id.eq.${currentUser.id},professional_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false });
        
        if (offersData) setOffers(offersData);
      }
    } catch (e) {
      console.error("Marketplace data fetch failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  }, [initialized, currentUser, mapProfile]);

  useEffect(() => {
    fetchMarketplaceData();
  }, [fetchMarketplaceData]);

  const handleUpdateOfferStatus = async (offerId: string, status: OfferStatus) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status })
        .eq('id', offerId);
      
      if (error) throw error;
      fetchMarketplaceData();
    } catch (e: any) {
      alert("Xəta: " + e.message);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchMarketplaceData();
      return;
    }
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
      setPros(filtered.length > 0 ? filtered : pros);
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setIsSearching(false);
    }
  };

  const selectedPro = useMemo(() => 
    pros.find(p => p.id === selectedProId) || null
  , [selectedProId, pros]);

  const handleBooking = async (details: { desc: string; date: string; time: string; location: string }) => {
    if (!currentUser) { setAuthMode('LOGIN'); setView('AUTH'); return; }
    if (!selectedPro || !supabase) return;

    try {
      const { error } = await supabase.from('offers').insert({
        customer_id: currentUser.id,
        professional_id: selectedPro.id,
        service_type: selectedPro.profession || selectedPro.skills[0] || 'Xidmət',
        description: details.desc,
        price: selectedPro.hourlyRate,
        date: details.date,
        time: details.time,
        location: details.location,
        status: 'PENDING'
      });

      if (error) throw error;

      alert(language === 'az' ? 'Sifariş uğurla göndərildi!' : 'Order sent successfully!');
      setSelectedProId(null);
      fetchMarketplaceData();
      setView('DASHBOARD');
    } catch (e: any) {
      alert("Sifariş xətası: " + e.message);
    }
  };

  const handleLogout = async () => {
    try {
      if (supabase) {
        // Global scope ensures all sessions are cleared across devices if needed
        await supabase.auth.signOut({ scope: 'global' });
      }
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      // Clear all local auth state
      setCurrentUser(null);
      setView('HOME');
      // Clear Supabase local storage manually to be safe
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      });
      // Force reload to completely reset application context
      window.location.href = '/';
    }
  };

  const handleOnboardingComplete = (updated: Profile) => {
    setCurrentUser(updated);
    setView('HOME');
  };

  const needsOnboarding = initialized && currentUser && !currentUser.onboarding_completed;

  if (!initialized) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <div className="text-center">
          <p className="font-black text-gray-900 text-sm tracking-tighter uppercase mb-1">Helper.az</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] animate-pulse">Yüklənir...</p>
        </div>
      </div>
    </div>
  );

  if (view === 'VERIFIED') {
    return <EmailVerifiedView language={language} onContinue={() => { setView('AUTH'); setAuthMode('LOGIN'); window.location.hash = ''; }} />;
  }

  if (needsOnboarding) {
    return <OnboardingView user={currentUser} language={language} onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {dbError && (
        <div className="bg-red-600 text-white text-center py-3 px-4 text-xs font-black animate-pulse sticky top-0 z-[100] shadow-lg flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {dbError}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-10">
              <div className="flex items-center cursor-pointer group" onClick={() => setView('HOME')}>
                <div className="bg-blue-600 w-10 h-10 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">H</div>
                <span className="ml-3 text-2xl font-black tracking-tight text-gray-900">Helper<span className="text-blue-600">.az</span></span>
              </div>
              
              <div className="hidden lg:flex gap-6 items-center border-l border-gray-100 pl-10">
                <button 
                  onClick={() => setView('HOME')} 
                  className={`text-sm font-black tracking-wide transition-all uppercase px-4 py-2 rounded-xl ${view === 'HOME' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  {t.home}
                </button>
                <a href="#how-it-works" className="text-sm font-black tracking-wide text-gray-400 hover:text-gray-900 uppercase px-4 py-2">{t.howItWorks}</a>
                <a href="#contact" className="text-sm font-black tracking-wide text-gray-400 hover:text-gray-900 uppercase px-4 py-2">{t.contact}</a>
                {currentUser && (
                  <button 
                    onClick={() => setView('DASHBOARD')} 
                    className={`text-sm font-black tracking-wide transition-all uppercase px-4 py-2 rounded-xl ${view === 'DASHBOARD' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    {t.panel}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <LanguageSelector current={language} onChange={setLanguage} />
              {currentUser ? (
                <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-black text-gray-900 leading-none mb-1">{currentUser.name}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{currentUser.role === 'PROFESSIONAL' ? t.proRole : t.customerRole}</p>
                  </div>
                  <button onClick={() => setView('PROFILE')} className="w-12 h-12 rounded-2xl border-2 border-gray-50 p-0.5 overflow-hidden ring-2 ring-transparent hover:ring-blue-100 transition-all shadow-md">
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[14px]" />
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Logout"
                  >
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
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
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
                    <h3 className="text-2xl font-black text-gray-900">{t.noProsFound}</h3>
                  </div>
                )}
              </div>
            </div>

            <LandingSections language={language} />
            
            <Footer language={language} onNavigate={setView} />
          </>
        )}

        {view === 'DASHBOARD' && currentUser && (
          <DashboardView 
            user={currentUser} 
            language={language} 
            offers={offers} 
            isRefreshing={isRefreshing}
            onRefresh={fetchMarketplaceData}
            onUpdateOfferStatus={handleUpdateOfferStatus}
            onStartPayment={(offer) => {
              setActiveOfferForPayment(offer);
              setView('CHECKOUT');
            }}
            onToggleAvailability={async (val) => {
               if (supabase) {
                 await supabase.from('profiles').update({ is_available: val }).eq('id', currentUser.id);
                 setCurrentUser({...currentUser, isAvailable: val});
               }
            }} 
            onEditProfile={() => setView('PROFILE_EDIT')} 
          />
        )}

        {view === 'CHECKOUT' && currentUser && activeOfferForPayment && (
          <CheckoutView 
            offer={activeOfferForPayment} 
            user={currentUser} 
            language={language} 
            onSuccess={() => {
              fetchMarketplaceData();
              setView('DASHBOARD');
            }} 
            onCancel={() => setView('DASHBOARD')} 
          />
        )}

        {view === 'PROFILE' && currentUser && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border border-white">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-800 relative"></div>
              <div className="px-12 pb-16 -mt-24 text-center relative z-10">
                <div className="inline-block relative">
                   <img src={currentUser.avatar} alt={currentUser.name} className="w-44 h-44 rounded-[56px] object-cover border-[10px] border-white shadow-2xl" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mt-6">{currentUser.name}</h2>
                <div className="mt-16 flex justify-center gap-6">
                   <button onClick={() => setView('PROFILE_EDIT')} className="px-10 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">{t.editProfile}</button>
                   <button onClick={() => setView('HOME')} className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-500 font-black rounded-3xl hover:bg-gray-50 transition-all text-xs uppercase tracking-widest">{t.home}</button>
                </div>
              </div>
            </div>
            <Footer language={language} onNavigate={setView} />
          </div>
        )}

        {view === 'PROFILE_EDIT' && currentUser && (
          <div className="max-w-7xl mx-auto px-4">
            <ProfileEditView 
              user={currentUser} 
              language={language} 
              onSave={(updated) => { setCurrentUser(updated); setView('PROFILE'); }} 
              onCancel={() => setView('PROFILE')} 
            />
            <Footer language={language} onNavigate={setView} />
          </div>
        )}

        {view === 'AUTH' && (
          <AuthView language={language} initialMode={authMode} onSuccess={() => setView('HOME')} onCancel={() => setView('HOME')} />
        )}
      </main>

      {selectedProId && (
        <BookingModal pro={selectedPro} language={language} onClose={() => setSelectedProId(null)} onSubmit={handleBooking} />
      )}
      {showConfigModal && <SupabaseConfigModal onClose={() => setShowConfigModal(false)} />}
    </div>
  );
};

export default App;
