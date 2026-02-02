
import React, { useState } from 'react';
import { saveSupabaseConfig } from '../lib/supabase';

interface Props {
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<Props> = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      saveSupabaseConfig(url, key);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Supabase Parametrləri</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
              <p className="text-sm text-amber-800 font-bold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Localhost & Rate Limit Həlli:
              </p>
              <ul className="text-xs text-amber-700 space-y-2 list-disc ml-4 font-medium">
                <li><strong>URL Xətası:</strong> Supabase Auth Settings-də <strong>Site URL</strong> hissəsini cari Vercel ünvanınızla dəyişin.</li>
                <li><strong>Email Limiti:</strong> "Rate limit" xətası üçün <strong>Custom SMTP</strong> (Resend və ya SendGrid) qoşmağınız mütləqdir.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Supabase Project URL</label>
              <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-project.supabase.co" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Anon API Key</label>
              <textarea required rows={2} value={key} onChange={(e) => setKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1Ni..." className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white outline-none font-mono text-xs leading-relaxed" />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all">Yadda saxla</button>
              <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-100 hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all">Ləğv et</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
