import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  PROBLEM_CATEGORIES,
  VERIFIED_OFFICIAL_RESOURCES,
  VERIFIED_LEGAL_PROVISIONS,
} from '../data/officialResources';
import { UrgencyLevel, LegalProvision, OfficialResource, NavigatorSession } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Save,
  RotateCcw,
  ExternalLink,
  Info,
  Scale,
  Clock,
  PhoneCall,
} from 'lucide-react';

export const RightsNavigatorPage: React.FC = () => {
  const { preferences, routeQuery, navigate, saveSession } = useApp();
  const t = getTranslation(preferences.language);

  // Read initial category or query from URL if present
  const initialCategory = routeQuery.get('category') || '';
  const initialQuery = routeQuery.get('q') || '';

  // Workflow steps: 1=Intake, 2=Urgency, 3=Clarification, 4=Results
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Problem Intake State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [problemText, setProblemText] = useState<string>(initialQuery);
  const [jurisdiction, setJurisdiction] = useState<string>('Kota, Rajasthan');
  const [intakeError, setIntakeError] = useState<string>('');

  // Step 2: Urgency State
  const [urgency, setUrgency] = useState<UrgencyLevel>('important_not_urgent');

  // Step 3: Clarification Answers State
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});

  // Generated Results State
  const [sessionResult, setSessionResult] = useState<NavigatorSession | null>(null);
  const [copiedChecklist, setCopiedChecklist] = useState<boolean>(false);
  const [sessionSaved, setSessionSaved] = useState<boolean>(false);

  // Update category if URL query changes
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialQuery && !problemText) setProblemText(initialQuery);
  }, [initialCategory, initialQuery]);

  // Validation for Step 1
  const handleIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim() && !selectedCategory) {
      setIntakeError(
        preferences.language === 'en'
          ? 'Please either describe your problem or select a category.'
          : 'कृपया अपनी समस्या का विवरण लिखें या श्रेणी का चयन करें।'
      );
      return;
    }
    setIntakeError('');
    setCurrentStep(2);
  };

  // Dynamic clarification questions based on category
  const getCategoryQuestions = () => {
    const cat = selectedCategory || 'general';
    switch (cat) {
      case 'police':
        return [
          {
            id: 'q_fir',
            question: 'Has an FIR (First Information Report) or police complaint been registered?',
            question_hi: 'क्या इस मामले में कोई एफआईआर या पुलिस शिकायत दर्ज हो चुकी है?',
            options: ['Yes, FIR copy received', 'No, police refused to file FIR', 'Complaint submitted, no FIR yet', 'Not yet approached police'],
          },
          {
            id: 'q_custody',
            question: 'Is any person currently detained, summoned to police station, or in custody?',
            question_hi: 'क्या किसी व्यक्ति को हिरासत में लिया गया है या थाने बुलाया गया है?',
            options: ['Yes, currently detained', 'Received Section 41A notice to appear', 'Anticipating arrest', 'No immediate custody issue'],
          },
        ];
      case 'cyber':
        return [
          {
            id: 'q_financial_loss',
            question: 'Was money debited without consent or stolen through an online transaction?',
            question_hi: 'क्या ऑनलाइन धोखाधड़ी से आपके बैंक खाते या यूपीआई से पैसे कटे हैं?',
            options: ['Yes, lost money within last 2 hours', 'Yes, occurred within 24 hours', 'Yes, occurred several days ago', 'No financial loss, identity/harassment issue'],
          },
          {
            id: 'q_bank_informed',
            question: 'Have you contacted your bank to block cards, net banking, or dispute transaction?',
            question_hi: 'क्या आपने अपने बैंक को फोन करके कार्ड या खाता ब्लॉक कराया है?',
            options: ['Yes, bank blocked and ticket raised', 'Attempted, waiting for response', 'Not yet contacted bank'],
          },
        ];
      case 'consumer':
        return [
          {
            id: 'q_proof',
            question: 'Do you have the purchase bill, payment receipt, or coaching fee invoice?',
            question_hi: 'क्या आपके पास खरीद का बिल, रसीद या कोचिंग फीस की इनवॉइस है?',
            options: ['Yes, original invoice and payment proof available', 'Payment proof exists, bill missing', 'No formal receipts'],
          },
          {
            id: 'q_notice_sent',
            question: 'Have you written to the company or coaching institute demanding a refund/resolution?',
            question_hi: 'क्या आपने विक्रेता या संस्थान को लिखित शिकायत या ईमेल भेजा है?',
            options: ['Yes, written email/letter sent with no resolution', 'Only verbal communication', 'Not yet sent'],
          },
        ];
      case 'employment':
        return [
          {
            id: 'q_contract',
            question: 'Do you have an appointment letter, contract, or salary credit slips?',
            question_hi: 'क्या आपके पास नियुक्ति पत्र (Appointment Letter) या सैलरी स्लिप है?',
            options: ['Yes, appointment letter and bank statements', 'Only bank credits/chats', 'Informal cash arrangement'],
          },
          {
            id: 'q_dues',
            question: 'What is the primary grievance?',
            question_hi: 'आपकी मुख्य शिकायत क्या है?',
            options: ['Unpaid wages/salary', 'Unlawful dismissal without notice', 'PF/Gratuity denied', 'Workplace harassment/POSH'],
          },
        ];
      default:
        return [
          {
            id: 'q_docs',
            question: 'Do you possess relevant documents, notices, or communication records?',
            question_hi: 'क्या आपके पास इस मामले से जुड़े दस्तावेज या लिखित प्रमाण हैं?',
            options: ['Yes, comprehensive records available', 'Some partial records', 'No written records'],
          },
          {
            id: 'q_prior_legal',
            question: 'Has any legal notice or court summon been served?',
            question_hi: 'क्या कोई कानूनी नोटिस या अदालती समन प्राप्त हुआ है?',
            options: ['Yes, received legal notice', 'Received court summon', 'No formal legal notice received'],
          },
        ];
    }
  };

  // Compile final results based on verified knowledge infrastructure
  const generateStructuredAssessment = () => {
    const textLower = problemText.toLowerCase();
    const cat = selectedCategory || (
      textLower.includes('cyber') || textLower.includes('otp') || textLower.includes('fraud') || textLower.includes('upi')
        ? 'cyber'
        : textLower.includes('police') || textLower.includes('fir') || textLower.includes('arrest')
        ? 'police'
        : textLower.includes('consumer') || textLower.includes('refund') || textLower.includes('coaching')
        ? 'consumer'
        : textLower.includes('salary') || textLower.includes('wage') || textLower.includes('job')
        ? 'employment'
        : 'general'
    );

    // Filter relevant statutory provisions
    let matchedProvisions: LegalProvision[] = [];
    if (cat === 'cyber') {
      matchedProvisions = VERIFIED_LEGAL_PROVISIONS.filter((p) => p.legal_source_id === 'it-act-2000');
    } else if (cat === 'police') {
      matchedProvisions = VERIFIED_LEGAL_PROVISIONS.filter((p) => p.legal_source_id === 'dk-basu-guidelines');
    } else if (cat === 'consumer') {
      matchedProvisions = VERIFIED_LEGAL_PROVISIONS.filter((p) => p.legal_source_id === 'consumer-act-2019');
    } else {
      matchedProvisions = VERIFIED_LEGAL_PROVISIONS.filter((p) => p.legal_source_id === 'lsa-act-1987');
    }

    // Filter relevant official resources
    let matchedResources = VERIFIED_OFFICIAL_RESOURCES.filter((r) => {
      if (cat === 'cyber') return r.category.includes('Cybercrime') || r.id === 'cybercrime-portal';
      if (cat === 'police') return r.id === 'kota-dlsa' || r.id === 'rslsa-portal';
      if (cat === 'consumer') return r.id === 'consumer-helpline';
      if (cat === 'employment') return r.id === 'shram-suvidha' || r.id === 'kota-dlsa';
      return r.id === 'kota-dlsa' || r.id === 'nalsa-portal' || r.id === 'rajasthan-sampark';
    });

    // Ensure Kota DLSA & NALSA are always available as fallback
    if (!matchedResources.some((r) => r.id === 'kota-dlsa')) {
      const dlsa = VERIFIED_OFFICIAL_RESOURCES.find((r) => r.id === 'kota-dlsa');
      if (dlsa) matchedResources.push(dlsa);
    }

    // Build facts vs unverified assumptions
    const userFacts: string[] = [];
    if (problemText.trim()) {
      userFacts.push(`User stated scenario: "${problemText.trim()}"`);
    }
    userFacts.push(`Reported jurisdiction: ${jurisdiction}`);
    userFacts.push(`Selected primary category: ${cat.toUpperCase()}`);

    Object.entries(clarificationAnswers).forEach(([k, v]) => {
      userFacts.push(`User clarification (${k}): ${v}`);
    });

    const assumptions: string[] = [
      'The facts provided have not been independently tested in a court of law or cross-examined.',
      'Statutory interpretations depend on exact dates, notices, and verifiable documents.',
      'No conclusive criminal guilt or civil liability is determined by this tool.',
    ];

    const missingInfo: string[] = [
      'Original documentary evidence, written contracts, or time-stamped communication logs.',
      'Exact dates of triggering events, notice receipts, or financial debits.',
      'Opposing party written replies or formal police station entries (GD entry / FIR number).',
    ];

    // Build preparation checklist
    const checklist = [
      {
        id: 'chk-1',
        text: 'Preserve all written messages, bank SMS alerts, emails, and transaction IDs without alteration.',
        completed: false,
        isMandatory: true,
      },
      {
        id: 'chk-2',
        text: 'Prepare a chronological timeline of events noting exact dates and times.',
        completed: false,
        isMandatory: true,
      },
      {
        id: 'chk-3',
        text: cat === 'cyber'
          ? 'Call 1930 immediately and obtain an NCRP acknowledgement number.'
          : cat === 'consumer'
          ? 'Lodge pre-litigation grievance at National Consumer Helpline (1915) or online at consumerhelpline.gov.in.'
          : 'Visit Kota DLSA Front Office at District Court Nayapura for free legal consultation if eligible.',
        completed: false,
        isMandatory: true,
      },
      {
        id: 'chk-4',
        text: 'Consult an enrolled advocate before making formal statements or signing settlements.',
        completed: false,
        isMandatory: false,
      },
    ];

    const session: NavigatorSession = {
      id: `session-${Date.now()}`,
      created_at: new Date().toISOString(),
      category: cat,
      raw_problem_description: problemText,
      urgency,
      answers: clarificationAnswers,
      user_reported_facts: userFacts,
      unverified_assumptions: assumptions,
      missing_information: missingInfo,
      matched_provisions: matchedProvisions,
      recommended_resources: matchedResources,
      next_step_checklist: checklist,
      lawful_options: [
        'Lodge formal grievance with designated regulatory portal.',
        'Apply for statutory legal aid under Section 12 of LSA Act 1987.',
        'Issue a lawful legal intimation or representation through an enrolled advocate.',
      ],
      disclaimer_acknowledged: true,
    };

    setSessionResult(session);
    setCurrentStep(4);
  };

  const handleCopyChecklist = () => {
    if (!sessionResult) return;
    const text = sessionResult.next_step_checklist
      .map((item, idx) => `[ ] ${idx + 1}. ${item.text}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 2500);
  };

  const handleSaveToWorkspace = () => {
    if (sessionResult) {
      saveSession(sessionResult);
      setSessionSaved(true);
      setTimeout(() => setSessionSaved(false), 2500);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setSelectedCategory('');
    setProblemText('');
    setClarificationAnswers({});
    setSessionResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header and Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
              Legal Navigation Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#202020]">
              {t.nav.rights_navigator}
            </h1>
          </div>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#202020] bg-white border border-[#202020]/20 rounded-md hover:bg-black/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: 'Problem Intake' },
            { num: 2, label: 'Urgency Check' },
            { num: 3, label: 'Clarifications' },
            { num: 4, label: 'Analysis & Plan' },
          ].map((st) => (
            <div key={st.num} className="flex-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentStep >= st.num ? 'bg-[#F28C28]' : 'bg-[#202020]/15'
                }`}
              />
              <span className="text-[10px] text-[#202020]/60 mt-1 block truncate">
                {st.num}. {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: PROBLEM INTAKE */}
      {currentStep === 1 && (
        <form onSubmit={handleIntakeSubmit} className="space-y-6 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#202020]">
              1. What issue or situation are you facing?
            </h2>
            <p className="text-xs text-[#202020]/70">
              Describe what happened in simple terms. You do not need to cite section numbers or statutory provisions.
            </p>
          </div>

          {/* Privacy Warning Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Privacy Safeguard:</p>
              <p>
                Do not enter passwords, OTPs, PINs, full Aadhaar/PAN numbers, bank account secrets, or private names. All processing remains on this device.
              </p>
            </div>
          </div>

          {/* Category Selector (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
              Select Problem Category (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROBLEM_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id === selectedCategory ? '' : c.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                    selectedCategory === c.id
                      ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] font-bold ring-1 ring-[#F28C28]'
                      : 'border-[#202020]/15 bg-white hover:bg-black/5 text-[#202020]/80'
                  }`}
                >
                  <p className="truncate font-semibold">{preferences.language === 'en' ? c.title : c.title_hi}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Multiline Problem Input */}
          <div>
            <label htmlFor="problem-description" className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
              Explain Your Situation
            </label>
            <textarea
              id="problem-description"
              rows={5}
              maxLength={1500}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="e.g. I transferred money via UPI to an online seller who disappeared, or the police served a notice to appear regarding an inquiry, or an employer refused to pay two months of wages..."
              className="w-full p-4 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-xl text-sm text-[#202020] focus:border-[#F28C28] focus:bg-white outline-hidden transition-all"
            />
            <div className="flex justify-between items-center text-[11px] text-[#202020]/60 mt-1">
              <span>{problemText.length}/1500 characters</span>
              <span>No account or signup required</span>
            </div>
          </div>

          {/* Jurisdiction */}
          <div>
            <label htmlFor="jurisdiction-select" className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
              Location / Jurisdiction
            </label>
            <select
              id="jurisdiction-select"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="p-2.5 bg-white border border-[#202020]/20 rounded-lg text-xs font-medium text-[#202020]"
            >
              <option value="Kota, Rajasthan">Kota, Rajasthan</option>
              <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
              <option value="Rajasthan (Other Districts)">Rajasthan (Other Districts)</option>
              <option value="All-India (National)">All-India (National)</option>
            </select>
          </div>

          {intakeError && (
            <p className="text-xs text-red-600 font-semibold">{intakeError}</p>
          )}

          <div className="pt-4 border-t border-[#202020]/10 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
            >
              <span>Next: Urgency Screening</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: URGENCY SCREENING */}
      {currentStep === 2 && (
        <div className="space-y-6 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#202020]">
              2. How urgent is this matter?
            </h2>
            <p className="text-xs text-[#202020]/70">
              Immediate danger or imminent arrest require immediate official contact rather than delayed analysis.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'immediate_danger' as UrgencyLevel,
                title: 'Immediate Physical Danger or Threat',
                desc: 'Someone is in direct bodily danger, physical violence, or distress.',
                warning: 'Call 112 directly. Do not wait for website analysis.',
                badge: 'EMERGENCY',
              },
              {
                id: 'financial_cyber_fraud' as UrgencyLevel,
                title: 'Financial Cyber Fraud (Within Golden Hour)',
                desc: 'Unauthorized UPI, net banking, or debit card withdrawal just occurred.',
                warning: 'Call 1930 immediately to freeze funds before transfer chains.',
                badge: 'CRITICAL',
              },
              {
                id: 'urgent_deadline' as UrgencyLevel,
                title: 'Imminent Legal or Court Hearing Deadline',
                desc: 'Notice received with a specific court appearance date or limitation deadline.',
                warning: 'Promptly contact an enrolled advocate or DLSA.',
                badge: 'TIME-SENSITIVE',
              },
              {
                id: 'important_not_urgent' as UrgencyLevel,
                title: 'Important Matter, But Not in Immediate Danger',
                desc: 'Consumer complaint, workplace dispute, civic grievance, or general legal query.',
                badge: 'STANDARD',
              },
              {
                id: 'unsure' as UrgencyLevel,
                title: 'Unsure of Urgency',
                desc: 'Need structured guidance to determine applicable timelines and remedies.',
                badge: 'UNSURE',
              },
            ].map((option) => (
              <label
                key={option.id}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  urgency === option.id
                    ? 'border-[#F28C28] bg-[#FDF3E7] ring-1 ring-[#F28C28]'
                    : 'border-[#202020]/15 hover:bg-black/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="urgency_radio"
                      checked={urgency === option.id}
                      onChange={() => setUrgency(option.id)}
                      className="mt-1 text-[#F28C28] focus:ring-[#F28C28]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#202020]">{option.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#202020]/10 text-[#202020]">
                          {option.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#202020]/75 mt-0.5">{option.desc}</p>
                      {option.warning && urgency === option.id && (
                        <p className="text-xs text-red-700 font-bold mt-2 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{option.warning}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Emergency Escalation Overlay if Immediate Danger selected */}
          {urgency === 'immediate_danger' && (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <PhoneCall className="w-5 h-5" />
                <span>Call Emergency Dispatch Immediately</span>
              </div>
              <p className="text-xs text-red-900 leading-relaxed">
                HAQNAAMA does not dispatch emergency services. Please dial <strong>112</strong> for immediate Police assistance, <strong>181</strong> for Rajasthan Women Helpline, or <strong>1098</strong> for Childline.
              </p>
              <div className="flex gap-2">
                <a
                  href="tel:112"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 112 (Police)</span>
                </a>
                <a
                  href="tel:1930"
                  className="px-4 py-2 bg-[#202020] hover:bg-black text-white font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 1930 (Cyber Fraud)</span>
                </a>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#202020]/10 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-[#202020] hover:bg-black/5 rounded-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
            >
              <span>Next: Clarifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CLARIFICATIONS */}
      {currentStep === 3 && (
        <div className="space-y-6 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#202020]">
              3. Context Questions ({selectedCategory ? selectedCategory.toUpperCase() : 'GENERAL'})
            </h2>
            <p className="text-xs text-[#202020]/70">
              Answer the questions below to match relevant statutory safeguards. You may skip any question.
            </p>
          </div>

          <div className="space-y-6">
            {getCategoryQuestions().map((q, idx) => (
              <div key={q.id} className="p-4 bg-[#F4F0E6]/40 border border-[#202020]/15 rounded-xl space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  Question {idx + 1}
                </span>
                <p className="text-sm font-bold text-[#202020]">
                  {preferences.language === 'en' ? q.question : q.question_hi}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setClarificationAnswers((prev) => ({
                          ...prev,
                          [q.id]: opt,
                        }))
                      }
                      className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                        clarificationAnswers[q.id] === opt
                          ? 'border-[#F28C28] bg-white text-[#202020] font-bold ring-1 ring-[#F28C28]'
                          : 'border-[#202020]/15 bg-white/70 hover:bg-white text-[#202020]/80'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#202020]/10 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-[#202020] hover:bg-black/5 rounded-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={generateStructuredAssessment}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
            >
              <span>Generate Source-Grounded Plan</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: STRUCTURED RESULTS & ACTION CHECKLIST */}
      {currentStep === 4 && sessionResult && (
        <div className="space-y-8">
          {/* Top Actions & Notification */}
          <div className="bg-white border-2 border-[#202020] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 bg-[#F28C28] text-white rounded-xs">
                  Source-Grounded Result
                </span>
                <span className="text-xs text-[#202020]/60">
                  {new Date(sessionResult.created_at).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#202020] mt-1">
                Navigated Rights & Procedural Plan
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyChecklist}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#F4F0E6] hover:bg-black/10 text-[#202020] rounded-md transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedChecklist ? 'Checklist Copied!' : 'Copy Checklist'}</span>
              </button>

              <button
                onClick={handleSaveToWorkspace}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#202020] hover:bg-black text-white rounded-md transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{sessionSaved ? 'Saved to Workspace!' : 'Save Session'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: What We Understood vs Unverified Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#202020]/15 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#202020]">
                <Info className="w-4 h-4 text-[#F28C28]" />
                <span>What We Understood (User-Reported Facts)</span>
              </div>
              <ul className="text-xs text-[#202020]/80 space-y-2 list-disc list-inside">
                {sessionResult.user_reported_facts.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#202020]/15 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#202020]">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Unverified Assumptions & Missing Details</span>
              </div>
              <ul className="text-xs text-[#202020]/80 space-y-2 list-disc list-inside">
                {sessionResult.unverified_assumptions.map((ass, i) => (
                  <li key={i}>{ass}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: Verified Legal Provisions from Source Registry */}
          <div className="bg-white border border-[#202020]/15 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#F28C28]">
                  Legal Source Registry
                </span>
                <h3 className="text-base font-bold text-[#202020]">
                  Applicable Statutory Provisions & Safeguards
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                Verified via India Code / Courts
              </span>
            </div>

            <div className="space-y-4">
              {sessionResult.matched_provisions.map((prov) => (
                <div
                  key={prov.id}
                  className="p-4 bg-[#F4F0E6]/40 border border-[#202020]/10 rounded-xl space-y-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#202020]">
                      {prov.source_name} · {prov.provision_number}
                    </span>
                    <span className="text-[10px] text-[#202020]/60">
                      Jurisdiction: {prov.jurisdiction}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#F28C28]">{prov.heading}</p>
                  <blockquote className="text-xs text-[#202020]/80 italic pl-3 border-l-2 border-[#F28C28]">
                    "{prov.official_text}"
                  </blockquote>
                  <div className="pt-2 text-xs text-[#202020]">
                    <span className="font-bold">Plain-Language Meaning: </span>
                    {prov.plain_language_explanation}
                  </div>
                  <p className="text-[10px] text-[#202020]/50 pt-1">
                    Audited by: {prov.reviewed_by} on {prov.reviewed_at}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Next-Step Action Checklist */}
          <div className="bg-white border border-[#202020]/15 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#F28C28]">
                  Structured Guidance
                </span>
                <h3 className="text-base font-bold text-[#202020]">
                  Your Preparation & Next-Step Checklist
                </h3>
              </div>
              <button
                onClick={handleCopyChecklist}
                className="text-xs text-[#F28C28] font-bold underline"
              >
                Copy to Clipboard
              </button>
            </div>

            <div className="space-y-2.5">
              {sessionResult.next_step_checklist.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-lg"
                >
                  <span className="text-xs font-bold text-[#202020] bg-white border border-[#202020]/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-xs text-[#202020] leading-relaxed">
                    <p className="font-medium">{item.text}</p>
                    {item.isMandatory && (
                      <span className="text-[10px] font-bold text-[#F28C28] uppercase">
                        Recommended Priority
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Relevant Official Gateways */}
          <div className="bg-white border border-[#202020]/15 rounded-xl p-6 space-y-4">
            <div className="border-b border-[#202020]/10 pb-3">
              <span className="text-[11px] font-bold uppercase text-[#F28C28]">
                Authoritative Destinations
              </span>
              <h3 className="text-base font-bold text-[#202020]">
                Designated Official Portals for this Matter
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sessionResult.recommended_resources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 bg-[#F4F0E6]/30 border border-[#202020]/15 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                      {res.jurisdiction}
                    </span>
                    <h4 className="text-xs font-bold text-[#202020] mt-0.5">{res.name}</h4>
                    <p className="text-[11px] text-[#202020]/70 mt-1 line-clamp-2">
                      {res.description}
                    </p>
                    {res.contact_details?.helpline && (
                      <p className="text-[11px] font-bold text-[#202020] mt-2">
                        📞 {res.contact_details.helpline}
                      </p>
                    )}
                  </div>

                  <a
                    href={res.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#202020] hover:bg-[#F28C28] text-white text-xs font-bold rounded-md transition-colors"
                  >
                    <span>Open Official Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#202020]/20 rounded-lg text-xs font-bold text-[#202020] hover:bg-black/5 transition-colors"
            >
              Start Another Search
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate('/complaint-assistant')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-[#202020]/20 rounded-lg text-xs font-bold text-[#202020] hover:bg-black/5 transition-colors"
              >
                Draft Legal Intimation
              </button>
              <button
                onClick={() => navigate('/my-workspace')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Go to My Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
