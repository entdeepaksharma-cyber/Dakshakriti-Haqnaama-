import React from 'react';
import { useApp } from '../context/AppContext';
import { Scale, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Statutory Terms & Disclaimers</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Terms of Use & Legal Boundaries
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1">
          Effective Date: October 2026 · HAQNAAMA (हक़नामा)
        </p>
      </div>

      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#202020]/80 leading-relaxed">
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Fundamental Legal Disclaimer</p>
            <p className="text-xs mt-1">
              HAQNAAMA is an educational and civic-navigation tool. It does NOT provide legal advice, legal opinions, or court representation. Accessing or using this site does NOT create an advocate-client relationship.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">1. Purpose of Service</h2>
          <p>
            The platform provides plain-language explanations of Indian statutes, landmark judicial directives (such as D.K. Basu arrest guidelines), and verified direct portals for official bodies (NALSA, RSLSA, Rajasthan Sampark 181, National Cyber Crime 1930, National Consumer Helpline 1915).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">2. No Guarantee of Outcomes</h2>
          <p>
            Legal disputes depend heavily on precise facts, evidence, limitation periods, and judicial discretion. HAQNAAMA cannot and does not guarantee that a complaint, petition, or application will result in any particular outcome, refund, or relief.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">3. Non-Adversarial Use & Lawful Conduct</h2>
          <p>
            Users agree not to use HAQNAAMA for harassment, threats, fabrication of evidence, impersonation, or obstruction of justice. Users must ensure that any facts entered in drafts are accurate to the best of their personal knowledge.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020]">4. Independent Verification Required</h2>
          <p>
            Laws, rules, court circulars, and fee structures change over time. While HAQNAAMA continuously reviews sources against India Code and official gazettes, users should verify critical deadlines with an enrolled advocate or the Secretary, District Legal Services Authority (DLSA).
          </p>
        </section>

        <div className="pt-4 border-t border-[#202020]/10 flex gap-4">
          <button
            onClick={() => navigate('/rights-navigator')}
            className="px-4 py-2 bg-[#F28C28] text-white text-xs font-bold rounded-lg hover:bg-[#D9771E] transition-colors"
          >
            I Understand, Continue to Navigator
          </button>
        </div>
      </div>
    </div>
  );
};
