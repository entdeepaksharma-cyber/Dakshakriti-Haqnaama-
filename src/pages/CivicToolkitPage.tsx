import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  Building2,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const CivicToolkitPage: React.FC = () => {
  const { preferences, navigate } = useApp();
  const t = getTranslation(preferences.language);

  const localAuthorities = [
    {
      name: 'Rajasthan Sampark Portal (CM Citizen Helpline)',
      name_hi: 'राजस्थान संपर्क पोर्टल (181 मुख्यमंत्री जन सुनवाई)',
      jurisdiction: 'Rajasthan State (Kota Coverage)',
      helpline: '181 (Toll-Free 24x7)',
      url: 'https://sampark.rajasthan.gov.in/',
      scope: 'State departments, municipal delays, water, electricity, and collectorate grievances.',
    },
    {
      name: 'Nagar Nigam Kota (North & South Municipal Corporations)',
      name_hi: 'नगर निगम कोटा (उत्तर एवं दक्षिण)',
      jurisdiction: 'Kota Urban',
      helpline: '0744-2500045',
      url: 'https://urban.rajasthan.gov.in/',
      scope: 'Streetlights, road maintenance, garbage disposal, drainage, and trade licenses.',
    },
    {
      name: 'Kota Development Authority (UIT / KDA)',
      name_hi: 'कोटा विकास प्राधिकरण (केडीए)',
      jurisdiction: 'Kota Metropolitan Region',
      helpline: '0744-2422718',
      url: 'https://urban.rajasthan.gov.in/',
      scope: 'Urban planning, land allotment, building regulations, and arterial road projects.',
    },
    {
      name: 'Centralized Public Grievance Portal (CPGRAMS)',
      name_hi: 'सीपीजीआरएएमएस (केंद्रीय पोर्टल)',
      jurisdiction: 'National (Central Agencies)',
      helpline: '011-24622691',
      url: 'https://pgportal.gov.in/',
      scope: 'Railways (Kota Junction), National Highways (NH-52/NH-27), Post Offices, and Nationalized Banks.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Local Civic Empowerment</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {t.nav.civic_toolkit} (Kota, Rajasthan)
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          {preferences.language === 'en'
            ? 'Actionable, non-adversarial civic pathways to resolve public infrastructure issues, municipal delays, and community concerns through official government portals.'
            : 'कोटा और राजस्थान में सड़क, पानी, सफाई, नगर निगम और सार्वजनिक सेवाओं से जुड़ी समस्याओं के विधिसम्मत समाधान की मार्गदर्शिका।'}
        </p>
      </div>

      {/* Non-adversarial civic participation code */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold uppercase text-[#202020] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
          <span>Responsible & Lawful Citizen Engagement</span>
        </h2>
        <p className="text-xs text-[#202020]/80 leading-relaxed">
          HAQNAAMA advocates for constructive, non-adversarial civic participation. We strictly prohibit harassment, threats, doxxing, or obstruction. Official grievance channels (such as Rajasthan Sampark 181 and RTI applications) offer legitimate, legally enforceable paths for municipal accountability.
        </p>
      </div>

      {/* 4-Step Civic Resolution Workflow */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#202020]">
          Standard 4-Step Civic Grievance Process
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 'Step 1: Document Evidence',
              desc: 'Take photographs showing exact location landmarks. Record dates, specific ward/area, and duration of the problem.',
            },
            {
              step: 'Step 2: Lodge with Sampark (181)',
              desc: 'Call 181 or log into sampark.rajasthan.gov.in. Keep your 12-digit complaint tracking ID safe.',
            },
            {
              step: 'Step 3: Escalate if Unresolved',
              desc: 'If unresolved within 15–30 days, file an escalation before the Additional District Magistrate (ADM) or Nagar Nigam Commissioner.',
            },
            {
              step: 'Step 4: Use RTI for Transparency',
              desc: 'If work is claimed to be completed but remains defective, file an RTI request for tender work orders and completion certificates.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-[#202020]/15 rounded-xl flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-xs font-black text-[#F28C28]">0{idx + 1}</span>
                <h3 className="text-xs font-bold text-[#202020] mt-1 mb-1.5">{item.step}</h3>
                <p className="text-[11px] text-[#202020]/75 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Local Authority Gateways */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#202020]">
          Designated Official Portals & Grievance Desks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localAuthorities.map((auth, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#202020]/15 rounded-xl p-5 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                  {auth.jurisdiction}
                </span>
                <h3 className="text-sm font-bold text-[#202020]">
                  {preferences.language === 'en' ? auth.name : auth.name_hi}
                </h3>
                <p className="text-xs text-[#202020]/75 leading-relaxed">
                  {auth.scope}
                </p>
                <div className="p-2 bg-[#F4F0E6] rounded-md text-xs font-bold text-[#202020] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>{auth.helpline}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#202020]/10 flex justify-end">
                <a
                  href={auth.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#202020] hover:text-[#F28C28]"
                >
                  <span>Open Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="bg-[#FDF3E7] border border-[#F28C28]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#202020]">Need to prepare a formal representation?</h3>
          <p className="text-xs text-[#202020]/70 mt-0.5">Use our Draft Assistant to assemble a structured letter for the Municipal Commissioner.</p>
        </div>
        <button
          onClick={() => navigate('/complaint-assistant')}
          className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
        >
          Open Draft Assistant
        </button>
      </div>
    </div>
  );
};
