
import React, { useState } from 'react';
import { Offer, Language, Profile } from '../types';
import { I18N } from '../constants';
import { supabase } from '../lib/supabase';

interface Props {
  offer: Offer;
  user: Profile;
  language: Language;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CheckoutView: React.FC<Props> = ({ offer, user, language, onSuccess, onCancel }) => {
  const t = I18N[language];
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: user.name });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!supabase) throw new Error("Database not connected");

      // 1. Create a transaction record
      const { error: transError } = await supabase.from('transactions').insert({
        offer_id: offer.id,
        customer_id: user.id,
        professional_id: offer.professional_id,
        amount: offer.price,
        status: 'completed',
        stripe_payment_intent_id: 'sim_pi_' + Math.random().toString(36).substring(7)
      });

      if (transError) throw transError;

      // 2. Update offer status to PAID
      const { error: offerError } = await supabase
        .from('offers')
        .update({ status: 'PAID' })
        .eq('id', offer.id);

      if (offerError) throw offerError;

      setPaid(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      alert("Payment Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.paymentSuccess}</h2>
          <p className="text-gray-500 mt-2 font-medium">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Payment Form */}
        <div className="flex-1">
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-blue-600 p-3 rounded-2xl text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                   </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t.checkoutTitle}</h2>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.cardNumber}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardData.number}
                      onChange={(e) => setCardData({...cardData, number: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19)})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all font-mono font-bold"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 grayscale opacity-50" alt="Visa" />
                       <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 grayscale opacity-50" alt="Mastercard" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.expiry}</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({...cardData, expiry: e.target.value.replace(/\//, '').replace(/(\d{2})/, '$1/').substring(0, 5)})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.cvc}</label>
                    <input 
                      type="text" 
                      required
                      maxLength={3}
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-blue-600 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black rounded-3xl shadow-2xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>{t.payNow} - {offer.price} AZN</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="w-full mt-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-6 border-t border-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.secureCheckout}</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80">
          <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-xl sticky top-28">
            <h3 className="text-xl font-black mb-8 tracking-tight">{t.summary}</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">{offer.service_type}</span>
                <span>{offer.price} AZN</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-400">{t.serviceFee}</span>
                <span className="text-green-400">0.00 AZN</span>
              </div>
              
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.totalAmount}</p>
                  <p className="text-3xl font-black">{offer.price} <span className="text-sm">AZN</span></p>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Ödənişdən sonra sifarişiniz təsdiqlənmiş (PAID) statusuna keçəcək.</p>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Helper.az vasitəsilə edilən ödənişlər 100% zəmanətlidir.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
