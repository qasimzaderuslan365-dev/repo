
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Supabase Quraşdırılması</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-8">
            <p className="text-sm text-blue-800 leading-relaxed font-medium">
              Bu məlumatları Supabase Dashboard-da <strong>Project Settings &gt; API</strong> bölməsindən tapa bilərsiniz.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Supabase Project URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Anon API Key</label>
              <textarea
                required
                rows={2}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
              >
                Yadda saxla və Qoşul
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 border border-gray-100 hover:bg-gray-50 text-gray-600 font-bold rounded-2xl transition-all"
              >
                Ləğv et
              </button>
            </div>
          </form>
          
          <p className="text-center mt-6 text-[10px] text-gray-400 font-medium">
            Məlumatlar yalnız brauzerinizin yerəl yaddaşında (localStorage) saxlanılacaq.
          </p>
        </div>
      </div>
    </div>
  );
};
