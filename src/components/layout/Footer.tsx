import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { preferences, navigate } = useApp();

  return (
    <footer className="bg-[#202020] text-[#F4F0E6] border-t border-[#F28C28]/30 pt-12 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mandatory Transparency & Legal Notice */}
        <div className="bg-[#2a2a2a] border border-[#F28C28]/40 rounded-xl p-4 sm:p-6 mb-10 text-xs text-[#F4F0E6]/90 leading-relaxed">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold text-sm text-[#F4F0E6] mb-1">
                {preferences.language === 'en'
                  ? 'Source Provenance & Institutional Boundary Notice'
                  : 'सत्यापित स्रोत एवं वैधानिक सीमाएं'}
              </p>
              <p>
                {preferences.language === 'en'
                  ? 'HAQNAAMA National Stakeholder Mapping is an independent civic-technology and geographic intelligence platform. All administrative units, official identifiers, corporate filings, and stakeholder relationships are derived strictly from published Government of India and statutory sources (Local Government Directory, Ministry of Corporate Affairs MCA21, India Code, eCourts NJDG, SEBI/BSE filings). HAQNAAMA does not invent corporate shareholding percentages or infer wrongdoing from network connections. All records are subject to human review and public dispute.'
                  : 'हक़नामा नेशनल स्टेकहोल्डर मैपिंग एक स्वतंत्र नागरिक-तकनीक और भौगोलिक डेटा मंच है। सभी प्रशासनिक इकाइयां, कॉर्पोरेट फाइलिंग और संस्थागत संबंध भारत सरकार के आधिकारिक स्रोतों (एलजीडी, एमसीए21, इंडिया कोड, ई-कोर्ट्स, सेबी) से सत्यापित हैं।'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white tracking-wider">HAQNAAMA</span>
              <span className="text-xs font-bold text-[#F28C28] uppercase">Stakeholder Mapping</span>
            </div>
            <p className="text-xs font-bold text-[#F28C28]">
              India's Geographic, Institutional & Stakeholder Intelligence OS
            </p>
            <p className="text-xs text-[#F4F0E6]/75 max-w-sm leading-relaxed">
              Founded by Deepak Sharma. Dedicated to transparent mapping of India's administrative architecture, government bodies, registered enterprises, and public accountability networks.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F4F0E6]/60 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
              <span>LGD & MCA21 Genuinely Sourced · Zero-Hallucination</span>
            </div>
          </div>

          {/* National Intelligence Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              National Intelligence
            </h3>
            <ul className="space-y-2 text-xs text-[#F4F0E6]/80">
              <li>
                <button onClick={() => navigate('/india-map')} className="hover:text-[#F28C28] transition-colors">
                  India Map
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/geography')} className="hover:text-[#F28C28] transition-colors">
                  Administrative Geography
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/entities')} className="hover:text-[#F28C28] transition-colors">
                  Entity Registry
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/companies')} className="hover:text-[#F28C28] transition-colors">
                  Corporate Ownership
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/stakeholders')} className="hover:text-[#F28C28] transition-colors">
                  Stakeholder Graph
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/search')} className="hover:text-[#F28C28] transition-colors">
                  Unified Search
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Data Governance */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              Data & Methodology
            </h3>
            <ul className="space-y-2 text-xs text-[#F4F0E6]/80">
              <li>
                <button onClick={() => navigate('/sources')} className="hover:text-[#F28C28] transition-colors">
                  Public Data Sources
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/coverage')} className="hover:text-[#F28C28] transition-colors">
                  Data Quality & Coverage
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/research')} className="hover:text-[#F28C28] transition-colors">
                  Research Workspace
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/corrections')} className="hover:text-[#F28C28] transition-colors">
                  Correction & Dispute Centre
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/methodology')} className="hover:text-[#F28C28] transition-colors">
                  Methodology & Verification
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="hover:text-[#F28C28] transition-colors">
                  Admin Console & Ingestion
                </button>
              </li>
            </ul>
          </div>

          {/* Research Fellowship (HLRF) */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              Research Fellowship
            </h3>
            <ul className="space-y-2 text-xs text-[#F4F0E6]/80">
              <li>
                <button onClick={() => navigate('/fellowship')} className="hover:text-[#F28C28] transition-colors">
                  Fellowship Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fellowship/projects')} className="hover:text-[#F28C28] transition-colors">
                  Research Proposals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fellowship/publications')} className="hover:text-[#F28C28] transition-colors">
                  Published Repository
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fellowship/apply-student')} className="hover:text-[#F28C28] transition-colors">
                  Student Co-Authorship
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fellowship/apply-mentor')} className="hover:text-[#F28C28] transition-colors">
                  Mentor Applications
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fellowship/tests')} className="hover:text-[#F28C28] transition-colors text-[#F28C28] font-bold">
                  Acceptance Tests (24)
                </button>
              </li>
            </ul>
          </div>

          {/* Citizen Legal Empowerment (Preserved Stages) */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              Citizen Legal Tools
            </h3>
            <ul className="space-y-2 text-xs text-[#F4F0E6]/80">
              <li>
                <button onClick={() => navigate('/rights-navigator')} className="hover:text-[#F28C28] transition-colors">
                  Rights Navigator
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/legal-aid')} className="hover:text-[#F28C28] transition-colors">
                  Legal Aid (NALSA/DLSA)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/complaint-assistant')} className="hover:text-[#F28C28] transition-colors">
                  Draft Assistant
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/civic-toolkit')} className="hover:text-[#F28C28] transition-colors">
                  Civic Action Toolkit
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/my-workspace')} className="hover:text-[#F28C28] transition-colors">
                  My Workspace
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/settings')} className="hover:text-[#F28C28] transition-colors">
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#F4F0E6]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F4F0E6]/60 gap-4">
          <p>© {new Date().getFullYear()} HAQNAAMA National Stakeholder Mapping. Founder: Deepak Sharma · Kota, Rajasthan.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/privacy')} className="hover:underline">Privacy</button>
            <span>·</span>
            <button onClick={() => navigate('/terms')} className="hover:underline">Terms</button>
            <span>·</span>
            <button onClick={() => navigate('/contact')} className="hover:underline">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
