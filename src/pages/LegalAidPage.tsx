import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { VERIFIED_OFFICIAL_RESOURCES, VERIFIED_LEGAL_PROVISIONS } from '../data/officialResources';
import { LegalAidEligibilityAnswers, EligibilityStatus } from '../types';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  PhoneCall,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  RotateCcw,
} from 'lucide-react';

export const LegalAidPage: React.FC = () => {
  const { preferences, navigate, addAuditLog } = useApp();
  const t = getTranslation(preferences.language);

  // Questionnaire state
  const [answers, setAnswers] = useState<LegalAidEligibilityAnswers>({
    category: 'civil',
    annual_income: 'under_3_lakh',
    is_woman_or_child: false,
    is_sc_st: false,
    is_custody: false,
    is_disabled: false,
    is_industrial_workman: false,
    jurisdiction: 'Kota, Rajasthan',
  });

  const [assessmentResult, setAssessmentResult] = useState<{
    status: EligibilityStatus;
    reasons: string[];
    statutory_basis: string;
    next_steps: string[];
  } | null>(null);

  const lsaProvision = VERIFIED_LEGAL_PROVISIONS.find((p) => p.legal_source_id === 'lsa-act-1987');

  const evaluateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const qualifyingCriteria: string[] = [];

    if (answers.is_woman_or_child) {
      qualifyingCriteria.push('Statutory category: Woman or child (Section 12(c) of LSA Act 1987 - no income ceiling applies)');
    }
    if (answers.is_sc_st) {
      qualifyingCriteria.push('Statutory category: Member of Scheduled Caste or Scheduled Tribe (Section 12(a) - no income ceiling applies)');
    }
    if (answers.is_custody) {
      qualifyingCriteria.push('Statutory category: Person in custody or juvenile home (Section 12(g))');
    }
    if (answers.is_disabled) {
      qualifyingCriteria.push('Statutory category: Person with disability (Section 12(d))');
    }
    if (answers.is_industrial_workman) {
      qualifyingCriteria.push('Statutory category: Industrial workman (Section 12(f))');
    }
    if (answers.annual_income === 'under_3_lakh') {
      qualifyingCriteria.push('Income eligibility: Annual family income under Rs. 3,00,000 (prescribed ceiling for Rajasthan State)');
    }

    let status: EligibilityStatus = 'unable_to_determine';
    const nextSteps: string[] = [];

    if (qualifyingCriteria.length > 0) {
      status = 'potentially_eligible';
      nextSteps.push('Visit the Front Office of District Legal Services Authority (DLSA), Kota at District Court Complex, Nayapura.');
      nextSteps.push('Carry relevant proof (Aadhaar/Voter ID, Income certificate or category certificate, case papers).');
      nextSteps.push('Fill the standard Form-1 application for free legal aid provided free of cost at the DLSA counter.');
      nextSteps.push('Alternatively, submit online application on NALSA portal (nalsa.gov.in) or call 15100.');
    } else {
      status = 'confirmation_required';
      nextSteps.push('If your income exceeds Rs. 3,00,000 and you do not fall in specified categories, legal aid may require special discretion by the DLSA Secretary.');
      nextSteps.push('You can still consult the DLSA Front Office for free initial legal advice and counseling.');
    }

    setAssessmentResult({
      status,
      reasons: qualifyingCriteria,
      statutory_basis: 'Section 12 of the Legal Services Authorities Act, 1987 read with Rajasthan State Legal Services Authority Rules.',
      next_steps: nextSteps,
    });

    addAuditLog('LEGAL_AID_ASSESSMENT', answers.jurisdiction, `Assessed status: ${status} with ${qualifyingCriteria.length} qualifying points.`);
  };

  const handleReset = () => {
    setAssessmentResult(null);
    setAnswers({
      category: 'civil',
      annual_income: 'under_3_lakh',
      is_woman_or_child: false,
      is_sc_st: false,
      is_custody: false,
      is_disabled: false,
      is_industrial_workman: false,
      jurisdiction: 'Kota, Rajasthan',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Section 12, Legal Services Authorities Act, 1987</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {preferences.language === 'en' ? 'Statutory Free Legal Aid' : 'मुफ़्त कानूनी सहायता एवं नालसा'}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          {preferences.language === 'en'
            ? 'Article 39A of the Constitution of India guarantees equal justice and free legal aid. Eligible citizens are entitled to an assigned court advocate paid by the state.'
            : 'भारतीय संविधान के अनुच्छेद 39A और विधिक सेवा प्राधिकरण अधिनियम के अंतर्गत पात्र नागरिकों को अदालत में मुफ़्त वकील और कानूनी सहायता पाने का वैधानिक अधिकार है।'}
        </p>
      </div>

      {/* Grid: Assessment Tool & DLSA Kota Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Questionnaire */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#202020] mb-2">
              Eligibility Assessment Questionnaire
            </h2>
            <p className="text-xs text-[#202020]/70 mb-6">
              Check if your situation qualifies under statutory criteria for state-sponsored free advocate representation.
            </p>

            <form onSubmit={evaluateEligibility} className="space-y-6">
              {/* Matter Type */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1.5">
                  Type of Legal Matter
                </label>
                <select
                  value={answers.category}
                  onChange={(e) => setAnswers({ ...answers, category: e.target.value })}
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-medium text-[#202020]"
                >
                  <option value="criminal">Criminal Defense / Police Case / Bail</option>
                  <option value="family">Family / Domestic Violence / Maintenance</option>
                  <option value="civil">Property / Civil Suit / Tenancy</option>
                  <option value="labour">Labour / Unpaid Wages</option>
                  <option value="consumer">Consumer Dispute</option>
                </select>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1.5">
                  Annual Household Income (Rajasthan ceiling: ₹3,00,000)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, annual_income: 'under_3_lakh' })}
                    className={`p-2.5 text-xs text-left rounded-lg border font-medium transition-all ${
                      answers.annual_income === 'under_3_lakh'
                        ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] font-bold'
                        : 'border-[#202020]/15 bg-white'
                    }`}
                  >
                    Up to ₹3,00,000 / Year (or BPL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswers({ ...answers, annual_income: 'above_3_lakh' })}
                    className={`p-2.5 text-xs text-left rounded-lg border font-medium transition-all ${
                      answers.annual_income === 'above_3_lakh'
                        ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] font-bold'
                        : 'border-[#202020]/15 bg-white'
                    }`}
                  >
                    Above ₹3,00,000 / Year
                  </button>
                </div>
              </div>

              {/* Statutory Special Categories */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
                  Statutory Exempt Categories (No income limit applies)
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'is_woman_or_child', label: 'Woman or Child (Under Section 12(c))' },
                    { key: 'is_sc_st', label: 'Member of Scheduled Caste (SC) or Scheduled Tribe (ST)' },
                    { key: 'is_custody', label: 'Under arrest, judicial custody, or juvenile home' },
                    { key: 'is_disabled', label: 'Person with Disability (under Disabilities Act)' },
                    { key: 'is_industrial_workman', label: 'Industrial workman in a factory or workshop' },
                  ].map((cat) => (
                    <label
                      key={cat.key}
                      className="flex items-center gap-2.5 p-2 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-md text-xs cursor-pointer hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={answers[cat.key as keyof LegalAidEligibilityAnswers] as boolean}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [cat.key]: e.target.checked,
                          })
                        }
                        className="rounded text-[#F28C28] focus:ring-[#F28C28]"
                      />
                      <span className="text-[#202020] font-medium">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#202020]/10">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs text-[#202020]/70 hover:text-[#202020]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
                >
                  Evaluate Eligibility
                </button>
              </div>
            </form>

            {/* Assessment Result */}
            {assessmentResult && (
              <div className="mt-6 pt-6 border-t-2 border-[#202020]/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F28C28] uppercase">
                    Preliminary Assessment Result
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                      assessmentResult.status === 'potentially_eligible'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {assessmentResult.status === 'potentially_eligible'
                      ? 'Potentially Eligible'
                      : 'Confirmation Required'}
                  </span>
                </div>

                <div className="p-3 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-[#202020]">Statutory Foundation:</p>
                  <p className="text-[#202020]/80">{assessmentResult.statutory_basis}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#202020]">Qualifying Points Identified:</p>
                  <ul className="text-xs text-[#202020]/80 space-y-1 list-disc list-inside">
                    {assessmentResult.reasons.length > 0 ? (
                      assessmentResult.reasons.map((r, i) => <li key={i}>{r}</li>)
                    ) : (
                      <li>No automatic qualifying category selected. General economic ceiling applies.</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-[#202020]">Recommended Actions:</p>
                  <ul className="text-xs text-[#202020]/80 space-y-1 list-disc list-inside">
                    {assessmentResult.next_steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Statutory Disclaimer */}
                <p className="text-[11px] text-[#202020]/60 italic border-t border-[#202020]/10 pt-2">
                  * Important: This questionnaire provides statutory information based on published rules. The final determination of legal aid eligibility and appointment of an advocate is made solely by the Member Secretary, DLSA or Legal Services Authority.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verified DLSA & NALSA Contacts */}
        <div className="space-y-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase">
              <MapPin className="w-4 h-4" />
              <span>Kota District DLSA Front Office</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#202020]">
                District Legal Services Authority, Kota
              </h3>
              <p className="text-xs text-[#202020]/70 mt-1">
                District and Sessions Court Complex, Nayapura, Kota, Rajasthan - 324001
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#202020]/10 text-xs">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#F28C28]" />
                <span className="font-semibold text-[#202020]">0744-2321456 / 15100</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#202020]/50" />
                <span className="text-[#202020]/75">10:00 AM – 5:00 PM (Court Working Days)</span>
              </p>
            </div>

            <a
              href="https://districts.ecourts.gov.in/kota"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
            >
              <span>Visit Kota eCourts DLSA</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* National NALSA Gateway */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>NALSA National Portal</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#202020]">
                National Legal Services Authority
              </h3>
              <p className="text-xs text-[#202020]/70 mt-1">
                Apply online for legal aid or track existing applications directly on the Central NALSA Portal.
              </p>
            </div>

            <div className="p-3 bg-[#F4F0E6] rounded-lg text-xs font-bold text-[#202020]">
              Toll-Free Helpline: 15100 (24x7)
            </div>

            <a
              href="https://nalsa.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-[#202020]/25 hover:border-[#F28C28] text-[#202020] text-xs font-bold rounded-lg transition-colors"
            >
              <span>Open NALSA Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Checklist of what to carry */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase text-[#202020]">
              What to Carry to DLSA Front Office:
            </h4>
            <ul className="text-xs text-[#202020]/80 space-y-1.5 list-disc list-inside">
              <li>Photo ID proof (Aadhaar Card, Voter Card)</li>
              <li>Income certificate, Ration card, or BPL card</li>
              <li>Copy of Police complaint, FIR, or Court Summon (if any)</li>
              <li>Relevant bills, agreements, or notices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
