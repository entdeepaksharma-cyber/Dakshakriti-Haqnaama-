import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  BookOpen,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Scale,
  Award,
  AlertCircle,
} from 'lucide-react';

interface Lesson {
  id: string;
  category: string;
  title: string;
  title_hi: string;
  source: string;
  official_link: string;
  simple_explanation: string;
  detailed_explanation: string;
  key_points: string[];
}

const LESSONS: Lesson[] = [
  {
    id: 'art-21',
    category: 'Constitutional Rights',
    title: 'Article 21: Protection of Life and Personal Liberty',
    title_hi: 'अनुच्छेद 21: जीवन और व्यक्तिगत स्वतंत्रता का अधिकार',
    source: 'Constitution of India (India Code Repository)',
    official_link: 'https://www.indiacode.nic.in/',
    simple_explanation: 'No citizen can be deprived of their life or personal freedom except according to fair, just, and lawful procedures established by law.',
    detailed_explanation: 'Article 21 has been broadly interpreted by the Supreme Court of India (Maneka Gandhi v. UOI) to include the right to live with human dignity, the right to speedy trial, free legal aid (Hussainara Khatoon), privacy (Puttaswamy judgment), and protection against arbitrary police detention.',
    key_points: [
      'Right to fair investigation and speedy justice.',
      'Right to privacy and bodily integrity.',
      'Unlawful detention violates basic constitutional guarantees.',
    ],
  },
  {
    id: 'arrest-safeguards',
    category: 'Criminal Procedure',
    title: 'Your Safeguards During Police Detention (D.K. Basu Rules)',
    title_hi: 'पुलिस हिरासत के दौरान नागरिक अधिकार (डी.के. बसु दिशा-निर्देश)',
    source: 'Supreme Court Landmark Ruling / Section 41B CrPC & BNSS',
    official_link: 'https://services.ecourts.gov.in/',
    simple_explanation: 'Police cannot secretly arrest or question anyone without wearing clear name tags, informing family, and recording an arrest memo.',
    detailed_explanation: 'Under D.K. Basu guidelines, police officers must display clear name tags with designations. A formal Arrest Memo must be prepared at the time of arrest with time, date, and signed by at least one respected witness. The arrested person has an absolute right to inform a relative or friend immediately, be medically examined every 48 hours, and be presented before a Judicial Magistrate within 24 hours of arrest.',
    key_points: [
      'Police officer must wear visible name badge and designation.',
      'Signed Arrest Memo is mandatory with witness signature.',
      'Mandatory production before Magistrate within 24 hours (excluding journey time).',
      'Right to meet an advocate during interrogation (not throughout, but during).',
    ],
  },
  {
    id: 'cyber-fraud-action',
    category: 'Cyber Laws',
    title: 'Golden Hour Action: Financial Cyber Fraud & UPI Scams',
    title_hi: 'साइबर वित्तीय धोखाधड़ी में गोल्डन ऑवर कदम',
    source: 'Information Technology Act, 2000 & MHA I4C Advisory',
    official_link: 'https://www.cybercrime.gov.in/',
    simple_explanation: 'If money was stolen online, the first 2 hours are the "Golden Hour". Calling 1930 immediately can freeze the money in the scammer\'s bank account before they withdraw it.',
    detailed_explanation: 'When an unauthorized debit occurs, fraudsters rapidly move funds through multiple mule accounts. The Ministry of Home Affairs operates the Citizen Financial Cyber Fraud Reporting System on Helpline 1930. Calling 1930 immediately triggers automated inter-bank liens across the RBI payments grid, trapping funds in intermediate accounts for reversal.',
    key_points: [
      'Call 1930 immediately with bank account number and transaction UTR.',
      'Immediately inform your bank branch in writing to log customer liability exemption.',
      'File formal report at cybercrime.gov.in and save acknowledgement PDF.',
    ],
  },
  {
    id: 'consumer-protection',
    category: 'Consumer Rights',
    title: 'Consumer Protection Act 2019: Defective Goods & Coaching Refunds',
    title_hi: 'उपभोक्ता संरक्षण अधिनियम 2019: खराब सेवा व रिफंड अधिकार',
    source: 'Department of Consumer Affairs, Govt. of India',
    official_link: 'https://consumerhelpline.gov.in/',
    simple_explanation: 'Any buyer who pays for goods or services (including student coaching fees in Kota) has a legal right to fair quality, refund for deficiency, and compensation for misleading claims.',
    detailed_explanation: 'The Consumer Protection Act, 2019 introduced Central Consumer Protection Authority (CCPA) and online E-Daakhil filing. CCPA guidelines specifically mandate coaching centers and educational institutions in hubs like Kota cannot retain unearned fee for remaining period if a student withdraws.',
    key_points: [
      'Right to file from home town, regardless of company headquarters location.',
      'E-Daakhil portal permits filing without advocate appearance.',
      'National Consumer Helpline 1915 facilitates fast pre-litigation settlement.',
    ],
  },
  {
    id: 'rti-act-2005',
    category: 'Civic Transparency',
    title: 'RTI Act 2005: How Any Citizen Can Access Government Files',
    title_hi: 'सूचना का अधिकार अधिनियम 2005: सरकारी अभिलेख पाने का नियम',
    source: 'DoPT, Ministry of Personnel, Public Grievances and Pensions',
    official_link: 'https://rtionline.gov.in/',
    simple_explanation: 'You can ask any public authority to provide certified copies of government files, tenders, expenditure, or status reports for a nominal ₹10 fee.',
    detailed_explanation: 'Under Section 6(1) of RTI Act 2005, any citizen can submit an application in Hindi or English without needing to explain why the information is sought. The Public Information Officer must respond within 30 days. If the request concerns life or liberty, information must be provided within 48 hours.',
    key_points: [
      'Nominal fee of ₹10 (BPL cardholders are completely fee-exempt).',
      'No personal reason or justification is required to seek public records.',
      'Right to inspect public works, certified material samples, and records.',
    ],
  },
];

export const LegalLiteracyPage: React.FC = () => {
  const { preferences } = useApp();
  const t = getTranslation(preferences.language);
  const [expandedId, setExpandedId] = useState<string>('art-21');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Statutory Civic Literacy</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {t.nav.legal_literacy}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          {preferences.language === 'en'
            ? 'Source-grounded educational modules explaining Indian constitutional protections, criminal procedure rights, and administrative grievance channels.'
            : 'भारतीय संविधान, आपराधिक प्रक्रिया संहिता एवं उपभोक्ता कानूनों पर आधारित प्रामाणिक कानूनी शिक्षा पाठ।'}
        </p>
      </div>

      <div className="space-y-4">
        {LESSONS.map((lesson) => {
          const isExpanded = expandedId === lesson.id;
          return (
            <div
              key={lesson.id}
              className="bg-white border border-[#202020]/15 rounded-2xl overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : lesson.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-black/2 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                    {lesson.category}
                  </span>
                  <h2 className="text-base font-bold text-[#202020] mt-0.5">
                    {preferences.language === 'en' ? lesson.title : lesson.title_hi}
                  </h2>
                  <p className="text-xs text-[#202020]/60 mt-1">
                    Source: {lesson.source}
                  </p>
                </div>

                <div className="p-1 rounded-md bg-[#F4F0E6] text-[#202020] shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#202020]/10 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold uppercase text-[#202020]/80 text-[11px] mb-1">
                      Summary (Plain Language)
                    </h3>
                    <p className="text-[#202020] leading-relaxed bg-[#F4F0E6]/40 p-3 rounded-lg">
                      {lesson.simple_explanation}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase text-[#202020]/80 text-[11px] mb-1">
                      Statutory Analysis & Precedent
                    </h3>
                    <p className="text-[#202020]/80 leading-relaxed">
                      {lesson.detailed_explanation}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FDF3E7] rounded-xl border border-[#F28C28]/25 space-y-2">
                    <p className="font-bold text-[#202020]">Key Legal Protections:</p>
                    <ul className="space-y-1.5 list-disc list-inside text-[#202020]/85">
                      {lesson.key_points.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#202020]/60">
                    <span>Verified via Legislative Repository</span>
                    <a
                      href={lesson.official_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#F28C28] hover:text-[#D9771E]"
                    >
                      <span>Review Statutory Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
