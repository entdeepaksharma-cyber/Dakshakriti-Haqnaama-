import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { preferences, navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent Data Policy</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Privacy Policy & Data Practices
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1">
          Last revised: October 2026 · HAQNAAMA Civic Infrastructure
        </p>
      </div>

      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#202020]/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">1. Local-First Architecture</h2>
          <p>
            HAQNAAMA is designed on a privacy-preserving, local-first foundation. The narratives you enter in the Rights Navigator, your selected answers, and the documents you generate in the Draft Assistant are stored directly in your web browser's <code>localStorage</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">2. What We Do NOT Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>We do NOT require user account creation or registration to access public legal information.</li>
            <li>We do NOT collect government identity numbers (Aadhaar, PAN, Passport).</li>
            <li>We do NOT store or sell user case narratives to commercial third parties, marketers, or data brokers.</li>
            <li>We do NOT log sensitive search terms on remote servers without explicit consent.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">3. AI Processing & Boundary Disclosure</h2>
          <p>
            When utilizing AI-assisted structuring or language translation, only the minimal anonymized textual context necessary to format the statutory explanation is processed. No private identifiers or case histories are retained for model training.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">4. Your Right to Delete</h2>
          <p>
            You have full control over your stored data. You can inspect your saved records in <strong>My Workspace</strong> or purge all local data instantly via the <strong>Settings</strong> page.
          </p>
        </section>

        <div className="pt-4 border-t border-[#202020]/10">
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-[#202020] text-white text-xs font-bold rounded-lg hover:bg-[#F28C28] transition-colors"
          >
            Manage Local Data in Settings
          </button>
        </div>
      </div>
    </div>
  );
};
