import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { preferences, addAuditLog } = useApp();
  const t = getTranslation(preferences.language);

  const [feedbackType, setFeedbackType] = useState<'correction' | 'outdated_source' | 'broken_link' | 'inquiry'>('correction');
  const [sourceName, setSourceName] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addAuditLog('USER_CORRECTION_SUBMITTED', feedbackType, `${sourceName}: ${description.slice(0, 80)}`);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Human Review & Corrections Desk</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {t.nav.contact}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-xl leading-relaxed">
          {preferences.language === 'en'
            ? 'Report outdated legal provisions, broken government portal links, or suggest updates. Submissions enter our source audit queue for legal reviewer verification.'
            : 'पुराने हो चुके कानूनी प्रावधानों, टूटे हुए सरकारी लिंक या त्रुटियों की सूचना दें। सभी सुझाव विधिक समीक्षा हेतु दर्ज किए जाते हैं।'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-2 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-[#202020]">Report Submitted for Review</h2>
              <p className="text-xs text-[#202020]/70 max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to HAQNAAMA's source accuracy. Your report has been added to our administrative review log.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setDescription('');
                  setSourceName('');
                }}
                className="px-4 py-2 bg-[#202020] text-white text-xs font-bold rounded-lg hover:bg-black"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1.5">
                  Report Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'correction', label: 'Inaccurate Legal Info' },
                    { id: 'outdated_source', label: 'Outdated Statutory Text' },
                    { id: 'broken_link', label: 'Broken Government URL' },
                    { id: 'inquiry', label: 'General Feedback' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFeedbackType(item.id as typeof feedbackType)}
                      className={`p-2.5 text-xs text-left rounded-lg border font-medium transition-all ${
                        feedbackType === item.id
                          ? 'border-[#F28C28] bg-[#FDF3E7] text-[#202020] font-bold'
                          : 'border-[#202020]/15 bg-white hover:bg-black/5 text-[#202020]/80'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                  Specific Page or Source Identifier
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Rights Navigator - Cybercrime Section 66D or Kota DLSA phone"
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                  Details of the Inaccuracy or Proposed Update
                </label>
                <textarea
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what is incorrect or provides the updated official notification/gazette URL..."
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/80 mb-1">
                  Your Email (Optional, for clarification)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@example.com (optional)"
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Review Queue</span>
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#202020] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Project Headquarters</span>
            </h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              <strong>HAQNAAMA Project</strong><br />
              Founder: Deepak Sharma<br />
              Kota, Rajasthan, India - 324001
            </p>
          </div>

          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3 text-xs text-[#202020]/80">
            <h3 className="font-bold uppercase text-[#202020] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Review Standard</span>
            </h3>
            <p>
              In accordance with Stage 05 & 06 requirements, user feedback does not automatically alter published legal content without documented verification against India Code or government gazettes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
