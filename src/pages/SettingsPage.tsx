import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { Language, TextSize, ContrastMode, ExplanationStyle } from '../types';
import {
  Settings as SettingsIcon,
  Globe,
  Eye,
  Zap,
  HelpCircle,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Shield,
  FileText,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    preferences,
    setLanguage,
    setTextSize,
    setContrastMode,
    setReducedMotion,
    setExplanationStyle,
    setAnalyticsConsent,
    resetOnboarding,
    clearAllUserData,
    navigate,
  } = useApp();

  const t = getTranslation(preferences.language);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all saved sessions and drafts from local storage?')) {
      clearAllUserData();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Stage 02 Accessibility & Preferences</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {t.settings.title}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-xl">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* 1. Language */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#202020]">
            <Globe className="w-4 h-4 text-[#F28C28]" />
            <span>{t.settings.language_label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                preferences.language === 'en'
                  ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                  : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`p-3 text-xs font-bold rounded-xl border text-left transition-all font-hindi ${
                preferences.language === 'hi'
                  ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                  : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        {/* 2. Text Size */}
        <div className="space-y-3 pt-6 border-t border-[#202020]/10">
          <div className="flex items-center gap-2 text-sm font-bold text-[#202020]">
            <Eye className="w-4 h-4 text-[#F28C28]" />
            <span>{t.settings.text_size_label}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(['standard', 'large', 'xlarge'] as TextSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`p-3 text-xs font-bold rounded-xl border text-center transition-all ${
                  preferences.text_size === size
                    ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                    : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
                }`}
              >
                {size === 'standard' ? 'Standard (16px)' : size === 'large' ? 'Large (18px)' : 'Extra Large (20px)'}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Contrast Mode */}
        <div className="space-y-3 pt-6 border-t border-[#202020]/10">
          <div className="flex items-center gap-2 text-sm font-bold text-[#202020]">
            <Eye className="w-4 h-4 text-[#F28C28]" />
            <span>{t.settings.contrast_label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['standard', 'high'] as ContrastMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setContrastMode(mode)}
                className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                  preferences.contrast_mode === mode
                    ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                    : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
                }`}
              >
                {mode === 'standard' ? 'Standard Warm Ivory Palette' : 'High-Contrast Solid Black & White'}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Motion & Animation */}
        <div className="space-y-3 pt-6 border-t border-[#202020]/10">
          <div className="flex items-center gap-2 text-sm font-bold text-[#202020]">
            <Zap className="w-4 h-4 text-[#F28C28]" />
            <span>{t.settings.motion_label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setReducedMotion(false)}
              className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                !preferences.reduced_motion
                  ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                  : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
              }`}
            >
              Standard Motion
            </button>
            <button
              onClick={() => setReducedMotion(true)}
              className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                preferences.reduced_motion
                  ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                  : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
              }`}
            >
              Reduced Motion (Disables All Animations)
            </button>
          </div>
        </div>

        {/* 5. Explanation Style */}
        <div className="space-y-3 pt-6 border-t border-[#202020]/10">
          <div className="flex items-center gap-2 text-sm font-bold text-[#202020]">
            <HelpCircle className="w-4 h-4 text-[#F28C28]" />
            <span>{t.settings.explanation_label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['simple', 'detailed'] as ExplanationStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setExplanationStyle(style)}
                className={`p-3 text-xs font-bold rounded-xl border text-left transition-all ${
                  preferences.explanation_style === style
                    ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] ring-1 ring-[#F28C28]'
                    : 'border-[#202020]/15 hover:bg-black/5 text-[#202020]/80'
                }`}
              >
                {style === 'simple' ? 'Simple Plain Language (Citizens)' : 'Detailed Statutory View (Students/Practitioners)'}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Onboarding & Privacy Reset */}
        <div className="space-y-4 pt-6 border-t border-[#202020]/10">
          <h3 className="text-xs font-bold uppercase text-[#202020]/70">
            System & Data Management
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={resetOnboarding}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4F0E6] hover:bg-black/10 text-xs font-bold text-[#202020] rounded-lg transition-colors border border-[#202020]/15"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.settings.reset_onboarding}</span>
            </button>

            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 rounded-lg transition-colors border border-red-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.settings.clear_workspace}</span>
            </button>
          </div>

          {clearedNotice && (
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.settings.workspace_cleared}</span>
            </p>
          )}
        </div>

        {/* 7. Legal Policy Links */}
        <div className="pt-6 border-t border-[#202020]/10 flex flex-wrap gap-4 text-xs font-semibold">
          <button onClick={() => navigate('/privacy')} className="text-[#202020] hover:text-[#F28C28] underline flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Read Privacy Policy</span>
          </button>
          <button onClick={() => navigate('/terms')} className="text-[#202020] hover:text-[#F28C28] underline flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Use & Disclaimers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
