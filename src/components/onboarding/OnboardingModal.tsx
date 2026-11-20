import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../services/i18n';
import { Language, TextSize, ContrastMode, ExplanationStyle } from '../../types';
import { X, Check, Globe, Eye, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    preferences,
    setLanguage,
    setTextSize,
    setContrastMode,
    setReducedMotion,
    setExplanationStyle,
    completeOnboarding,
    skipOnboarding,
    showOnboarding,
  } = useApp();

  const [step, setStep] = useState<number>(0);
  const t = getTranslation(preferences.language);

  if (!showOnboarding) return null;

  const totalSteps = 5; // 0: Welcome, 1: Language, 2: Accessibility, 3: How it works, 4: Privacy

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="relative w-full max-w-2xl bg-[#F4F0E6] text-[#202020] border-2 border-[#202020] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#202020]/15 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-[#202020]">HAQNAAMA</span>
            <span className="text-sm font-semibold text-[#F28C28] font-hindi">हक़नामा</span>
          </div>

          <div className="flex items-center gap-4">
            {step > 0 && (
              <span className="text-xs text-[#202020]/60 font-medium">
                Step {step} of 4
              </span>
            )}
            <button
              onClick={skipOnboarding}
              className="text-xs text-[#202020]/70 hover:text-[#202020] underline font-medium p-1 focus-visible:ring-2 focus-visible:ring-[#F28C28]"
            >
              {t.onboarding.skip}
            </button>
          </div>
        </div>

        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                {t.brand.tagline}
              </span>
              <h2 id="onboarding-title" className="text-2xl sm:text-3xl font-extrabold text-[#202020]">
                {t.hero.headline}
              </h2>
              <p className="text-sm sm:text-base text-[#202020]/80 leading-relaxed">
                {t.onboarding.welcome_body}
              </p>
            </div>

            <div className="bg-white border border-[#202020]/15 rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
                <div className="text-xs text-[#202020]/80 space-y-1">
                  <p className="font-bold text-[#202020]">100% Free & Source-Grounded</p>
                  <p>
                    All guidance is directly referenced to official Indian legislation, supreme court directives, and statutory legal aid frameworks (NALSA & Kota, Rajasthan DLSAs).
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold rounded-lg transition-colors text-sm shadow-sm"
              >
                <span>{t.onboarding.get_started}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={skipOnboarding}
                className="py-3 px-6 bg-white hover:bg-black/5 text-[#202020] font-semibold border border-[#202020]/20 rounded-lg transition-colors text-sm"
              >
                {t.onboarding.skip}
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F28C28]">
                <Globe className="w-5 h-5" />
                <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-[#202020]">
                  {t.onboarding.lang_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#202020]/75">
                {t.onboarding.lang_body}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                  preferences.language === 'en'
                    ? 'border-[#F28C28] bg-white ring-2 ring-[#F28C28]/20'
                    : 'border-[#202020]/20 bg-white/60 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base text-[#202020]">English</span>
                    {preferences.language === 'en' && <Check className="w-4 h-4 text-[#F28C28]" />}
                  </div>
                  <p className="text-xs text-[#202020]/70">
                    Primary navigation, rights checklists, and statutory provisions in English.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between font-hindi ${
                  preferences.language === 'hi'
                    ? 'border-[#F28C28] bg-white ring-2 ring-[#F28C28]/20'
                    : 'border-[#202020]/20 bg-white/60 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base text-[#202020]">हिन्दी (Hindi)</span>
                    {preferences.language === 'hi' && <Check className="w-4 h-4 text-[#F28C28]" />}
                  </div>
                  <p className="text-xs text-[#202020]/70 font-sans">
                    सरल हिन्दी में कानूनी अधिकार, चेकलिस्ट और सरकारी पोर्टलों की जानकारी।
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#202020]/10">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#202020] hover:bg-black/5 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D9771E] rounded-md shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ACCESSIBILITY PREFERENCES */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#F28C28]">
                <Eye className="w-5 h-5" />
                <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-[#202020]">
                  {t.onboarding.a11y_title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#202020]/75">
                {t.onboarding.a11y_body}
              </p>
            </div>

            <div className="space-y-4">
              {/* Text Size */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
                  {t.onboarding.text_size}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'large', 'xlarge'] as TextSize[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setTextSize(size)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        preferences.text_size === size
                          ? 'border-[#F28C28] bg-white text-[#202020] font-bold shadow-xs'
                          : 'border-[#202020]/15 bg-white/50 hover:bg-white text-[#202020]/80'
                      }`}
                    >
                      {size === 'standard' ? 'Standard' : size === 'large' ? 'Large (+12%)' : 'Extra Large (+25%)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast Mode */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
                  {t.onboarding.contrast}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['standard', 'high'] as ContrastMode[]).map((cMode) => (
                    <button
                      key={cMode}
                      type="button"
                      onClick={() => setContrastMode(cMode)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        preferences.contrast_mode === cMode
                          ? 'border-[#F28C28] bg-white text-[#202020] font-bold shadow-xs'
                          : 'border-[#202020]/15 bg-white/50 hover:bg-white text-[#202020]/80'
                      }`}
                    >
                      {cMode === 'standard' ? 'Standard Contrast' : 'High Contrast (Pure White/Black)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion Preference */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
                  {t.onboarding.motion}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReducedMotion(false)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      !preferences.reduced_motion
                        ? 'border-[#F28C28] bg-white text-[#202020] font-bold shadow-xs'
                        : 'border-[#202020]/15 bg-white/50 hover:bg-white text-[#202020]/80'
                    }`}
                  >
                    Smooth Animations
                  </button>
                  <button
                    type="button"
                    onClick={() => setReducedMotion(true)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      preferences.reduced_motion
                        ? 'border-[#F28C28] bg-white text-[#202020] font-bold shadow-xs'
                        : 'border-[#202020]/15 bg-white/50 hover:bg-white text-[#202020]/80'
                    }`}
                  >
                    Reduced Motion (No Animation)
                  </button>
                </div>
              </div>

              {/* Explanation Style */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-2">
                  {t.onboarding.explanation}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['simple', 'detailed'] as ExplanationStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setExplanationStyle(style)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        preferences.explanation_style === style
                          ? 'border-[#F28C28] bg-white text-[#202020] font-bold shadow-xs'
                          : 'border-[#202020]/15 bg-white/50 hover:bg-white text-[#202020]/80'
                      }`}
                    >
                      {style === 'simple' ? 'Simple & Direct (Layman)' : 'Detailed (With Statutory References)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#202020]/10">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#202020] hover:bg-black/5 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D9771E] rounded-md shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: HOW HAQNAAMA WORKS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-[#202020]">
                {t.how_it_works.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#202020]/75">
                Displaying the transparent six-step civic methodology:
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { step: '1. DESCRIBE', text: t.how_it_works.step1_desc },
                { step: '2. UNDERSTAND', text: t.how_it_works.step2_desc },
                { step: '3. VERIFY', text: t.how_it_works.step3_desc },
                { step: '4. NAVIGATE', text: t.how_it_works.step4_desc },
                { step: '5. PREPARE', text: t.how_it_works.step5_desc },
                { step: '6. ACT', text: t.how_it_works.step6_desc },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#202020]/10 rounded-lg flex items-start gap-3">
                  <span className="text-xs font-extrabold text-[#F28C28] bg-[#F28C28]/10 px-2 py-0.5 rounded-sm shrink-0">
                    {item.step}
                  </span>
                  <p className="text-xs text-[#202020]/80">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Notice: </span>
              "HAQNAAMA provides legal information and navigation. It does not guarantee legal advice or a particular outcome. Important decisions may require assistance from a qualified legal professional."
            </div>

            <div className="flex justify-between pt-4 border-t border-[#202020]/10">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#202020] hover:bg-black/5 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D9771E] rounded-md shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRIVACY CHOICES */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 id="onboarding-title" className="text-xl sm:text-2xl font-bold text-[#202020]">
                {t.onboarding.privacy_title}
              </h2>
              <p className="text-xs sm:text-sm text-[#202020]/75">
                {t.onboarding.privacy_body}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white border border-[#202020]/15 rounded-xl space-y-2">
                <p className="text-xs font-bold text-[#202020]">Actual Data Practices:</p>
                <ul className="text-xs text-[#202020]/80 space-y-1.5 list-disc list-inside">
                  <li><strong>Local Persistence:</strong> All case narratives, search drafts, and checklists stay in your browser local storage.</li>
                  <li><strong>No Account Forced:</strong> You never have to sign up or provide an email to use public information.</li>
                  <li><strong>No Sensitive IDs:</strong> We never request Aadhaar, OTPs, bank passwords, or sensitive case files.</li>
                  <li><strong>Control:</strong> You can clear all saved data anytime from the Settings page.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#202020]/10">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#202020] hover:bg-black/5 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => completeOnboarding()}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-[#F28C28] hover:bg-[#D9771E] rounded-md shadow-sm"
              >
                <span>{t.onboarding.finish}</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
