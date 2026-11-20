/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Module 3: Student Application Workflow — HAQNAAMA Legal Research Fellowship
 */

import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Send,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  BookOpen,
  HelpCircle,
  FileText,
  User,
  ArrowRight,
} from 'lucide-react';
import { StudentApplicationStatus } from '../../types/fellowship';

export const StudentApplicationPage: React.FC = () => {
  const { submitStudentApplication, studentApplications, currentUserId, config } = useFellowship();
  const { navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('B.A. LL.B. (Hons.)');
  const [currentSemesterYear, setCurrentSemesterYear] = useState('3rd Year (V Semester)');
  const [legalInterestsInput, setLegalInterestsInput] = useState('Constitutional Law, Fundamental Rights, Data Governance');
  const [languagesInput, setLanguagesInput] = useState('English, Hindi');
  const [researchExperience, setResearchExperience] = useState('');
  const [writingSampleTitle, setWritingSampleTitle] = useState('');
  const [writingSampleText, setWritingSampleText] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [availabilityHours, setAvailabilityHours] = useState(12);
  const [preferredThemes, setPreferredThemes] = useState('Constitutional Privacy, Public Administration & Welfare, Digital Legal Systems');
  const [relevantSkills, setRelevantSkills] = useState('Statutory Interpretation, Case Law Digesting, Bluebook Formatting');

  // Consent & Declarations
  const [truthfulnessConfirmed, setTruthfulnessConfirmed] = useState(false);
  const [ethicsPolicyAccepted, setEthicsPolicyAccepted] = useState(false);
  const [nonPlagiarismPledged, setNonPlagiarismPledged] = useState(false);
  const [availabilityCommitment, setAvailabilityCommitment] = useState(false);

  // Submission Status
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    appId?: string;
    error?: string;
  } | null>(null);

  // Tracking tab search
  const [trackQuery, setTrackQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!truthfulnessConfirmed || !ethicsPolicyAccepted || !nonPlagiarismPledged || !availabilityCommitment) {
      setSubmitResult({
        success: false,
        error: 'Please complete all mandatory declarations and consent pledges before submitting.',
      });
      return;
    }

    const res = submitStudentApplication({
      applicantId: currentUserId || `stud-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      university: university.trim(),
      degree: degree.trim(),
      currentSemesterYear: currentSemesterYear.trim(),
      areasOfLegalInterest: legalInterestsInput.split(',').map((s) => s.trim()).filter(Boolean),
      languages: languagesInput.split(',').map((s) => s.trim()).filter(Boolean),
      researchExperience: researchExperience.trim(),
      writingSampleTitle: writingSampleTitle.trim() || undefined,
      writingSampleText: writingSampleText.trim() || undefined,
      learningObjectives: learningObjectives.trim(),
      availabilityHoursPerWeek: Number(availabilityHours),
      preferredThemes: preferredThemes.split(',').map((s) => s.trim()).filter(Boolean),
      relevantSkills: relevantSkills.split(',').map((s) => s.trim()).filter(Boolean),
      consentAndDeclarations: {
        truthfulnessConfirmed,
        ethicsPolicyAccepted,
        nonPlagiarismPledged,
        availabilityCommitment,
      },
    });

    setSubmitResult(res);
    if (res.success && res.id) {
      setTrackQuery(email.trim());
    }
  };

  const getStatusBadge = (status: StudentApplicationStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[11px]">ACCEPTED</span>;
      case 'INTERVIEW':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-md text-[11px]">INTERVIEW SCHEDULED</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md text-[11px]">UNDER REVIEW</span>;
      case 'INFORMATION_REQUESTED':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-md text-[11px]">INFO REQUESTED</span>;
      case 'WAITLISTED':
        return <span className="px-2.5 py-1 bg-orange-100 text-orange-800 font-bold rounded-md text-[11px]">WAITLISTED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-md text-[11px]">NOT SELECTED</span>;
      case 'WITHDRAWN':
        return <span className="px-2.5 py-1 bg-gray-200 text-gray-700 font-bold rounded-md text-[11px]">WITHDRAWN</span>;
      case 'SUBMITTED':
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 font-bold rounded-md text-[11px]">SUBMITTED</span>;
    }
  };

  const matchedApps = studentApplications.filter(
    (a) =>
      trackQuery &&
      (a.email.toLowerCase().includes(trackQuery.trim().toLowerCase()) ||
        a.id.toLowerCase().includes(trackQuery.trim().toLowerCase()) ||
        a.fullName.toLowerCase().includes(trackQuery.trim().toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Stage 03 Student Co-Authorship Admissions</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Student Co-Author Application
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 leading-relaxed">
          Open to undergraduate law students in India. Apply to work directly alongside an approved research mentor on a semester-long publication track. Students without prior publications are explicitly welcomed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#202020]/15 pb-2">
        <button
          onClick={() => setActiveTab('apply')}
          className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-colors ${
            activeTab === 'apply' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          New Application
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-colors ${
            activeTab === 'track' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Track Application Status
        </button>
      </div>

      {activeTab === 'apply' ? (
        <form onSubmit={handleSubmit} className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {submitResult && (
            <div
              className={`p-4 rounded-xl border text-xs ${
                submitResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {submitResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application Submitted Successfully!</span>
                  </div>
                  <p>
                    Your application ID is <strong>{submitResult.appId}</strong>. A confirmation has been logged in the programme registry. You can track decisions in the "Track Application Status" tab.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitResult.error}</span>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Personal & Institutional Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider border-b border-[#202020]/10 pb-1">
              1. Personal & University Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. p.sharma@student.law.in"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98290 12345"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Law Faculty / University *</label>
                <input
                  type="text"
                  required
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University Law College, Jaipur / NLU / GLC"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Degree Programme *</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-white font-medium"
                >
                  <option value="B.A. LL.B. (Hons.)">B.A. LL.B. (Hons.) 5-Year Integrated</option>
                  <option value="B.B.A. LL.B. (Hons.)">B.B.A. LL.B. (Hons.) 5-Year Integrated</option>
                  <option value="B.Sc. LL.B. / B.Tech. LL.B.">B.Sc. / B.Tech. LL.B.</option>
                  <option value="LL.B. (Three Year Professional)">LL.B. (Three Year Professional)</option>
                  <option value="Other Law Programme">Other Law Programme</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Current Academic Semester *</label>
                <input
                  type="text"
                  required
                  value={currentSemesterYear}
                  onChange={(e) => setCurrentSemesterYear(e.target.value)}
                  placeholder="e.g. 3rd Year (VI Semester)"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Research Interests, Skills & Experience */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider border-b border-[#202020]/10 pb-1">
              2. Research Interests & Skills
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Areas of Legal Interest (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={legalInterestsInput}
                  onChange={(e) => setLegalInterestsInput(e.target.value)}
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Languages (for legal research and source translation) *</label>
                <input
                  type="text"
                  required
                  value={languagesInput}
                  onChange={(e) => setLanguagesInput(e.target.value)}
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Research Experience & Prior Work</label>
                <textarea
                  rows={3}
                  value={researchExperience}
                  onChange={(e) => setResearchExperience(e.target.value)}
                  placeholder="Describe any coursework, moot court research, clinical legal aid clinic participation, or literature review work. (No prior publications required!)"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Writing Sample (Optional — text excerpt or paper title)</label>
                <input
                  type="text"
                  value={writingSampleTitle}
                  onChange={(e) => setWritingSampleTitle(e.target.value)}
                  placeholder="Title of past essay, case comment, or moot memorial"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium mb-2"
                />
                <textarea
                  rows={3}
                  value={writingSampleText}
                  onChange={(e) => setWritingSampleText(e.target.value)}
                  placeholder="Paste a short 200–500 word sample of your legal writing or statutory analysis..."
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Learning Objectives *</label>
                <textarea
                  rows={2}
                  required
                  value={learningObjectives}
                  onChange={(e) => setLearningObjectives(e.target.value)}
                  placeholder="What specific research, statutory drafting, or academic writing skills do you aim to master during this fellowship?"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#202020] mb-1">Weekly Availability (Hours) *</label>
                  <input
                    type="number"
                    min={8}
                    max={25}
                    required
                    value={availabilityHours}
                    onChange={(e) => setAvailabilityHours(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                  />
                  <p className="text-[10px] text-[#202020]/60 mt-0.5">Recommended: 10–14 hours/week.</p>
                </div>

                <div>
                  <label className="block font-bold text-[#202020] mb-1">Relevant Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={relevantSkills}
                    onChange={(e) => setRelevantSkills(e.target.value)}
                    className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Declarations and Academic Ethics */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider border-b border-[#202020]/10 pb-1">
              3. Ethics, Plagiarism & Co-Authorship Declarations
            </h2>

            <div className="space-y-2.5 text-xs text-[#202020]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={truthfulnessConfirmed}
                  onChange={(e) => setTruthfulnessConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-[#F28C28]"
                />
                <span>I certify that all educational credentials, university enrollment, and statements are accurate and true.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={ethicsPolicyAccepted}
                  onChange={(e) => setEthicsPolicyAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#F28C28]"
                />
                <span>I accept the HAQNAAMA Research Ethics and Authorship Policy, including mandatory pre-agreed co-authorship agreements.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={nonPlagiarismPledged}
                  onChange={(e) => setNonPlagiarismPledged(e.target.checked)}
                  className="mt-0.5 rounded text-[#F28C28]"
                />
                <span>I pledge that all research notes, case digests, and draft contributions will be original and strictly attributed, with zero tolerance for plagiarism or AI hallucination of legal authorities.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={availabilityCommitment}
                  onChange={(e) => setAvailabilityCommitment(e.target.checked)}
                  className="mt-0.5 rounded text-[#F28C28]"
                />
                <span>I commit to participating actively in weekly team meetings and meeting milestone draft deadlines throughout the semester cycle.</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-[#202020]/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-[#202020]/60">
              Applications are reviewed by the Research Admissions Committee on a rolling basis.
            </span>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Application</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Track Tab */
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#202020]">Track Your Application Status</h2>
            <p className="text-xs text-[#202020]/75">
              Enter your email address or application ID to inspect admissions triage and committee decisions.
            </p>
          </div>

          <div className="flex gap-2 max-w-lg">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="e.g. aarav.singhania@student.nludelhi.ac.in or stud-app-01"
              className="flex-1 p-2.5 border border-[#202020]/20 rounded-lg text-xs outline-hidden focus:border-[#F28C28]"
            />
          </div>

          {trackQuery && matchedApps.length === 0 && (
            <div className="p-4 bg-[#F4F0E6]/50 rounded-xl text-xs text-[#202020]/70 text-center">
              No matching applications found. Please check spelling or verify you applied with this email.
            </div>
          )}

          {matchedApps.map((app) => (
            <div key={app.id} className="p-5 border border-[#202020]/15 rounded-xl space-y-4 bg-[#F4F0E6]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#202020]">{app.fullName}</h3>
                  <p className="text-xs text-[#202020]/70">{app.university} · {app.degree} ({app.currentSemesterYear})</p>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#202020]/60 block text-[10px] uppercase font-bold">Application ID</span>
                  <span className="font-mono font-bold text-[#202020]">{app.id}</span>
                </div>
                <div>
                  <span className="text-[#202020]/60 block text-[10px] uppercase font-bold">Submitted At</span>
                  <span className="font-medium text-[#202020]">{new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[#202020]/60 block text-[10px] uppercase font-bold">Availability</span>
                  <span className="font-medium text-[#202020]">{app.availabilityHoursPerWeek} hrs / week</span>
                </div>
              </div>

              {app.reviewerNotes && (
                <div className="p-3 bg-white border border-[#202020]/10 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-[#F28C28] text-[11px] uppercase tracking-wider block">
                    Review Committee Remark
                  </span>
                  <p className="text-[#202020]/80">{app.reviewerNotes}</p>
                </div>
              )}

              {app.status === 'ACCEPTED' && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-emerald-800 font-semibold">
                    Assigned to Project: <strong>Welfare Delivery and Deemed Consent (DPDP Act)</strong>
                  </span>
                  <button
                    onClick={() => navigate('/fellowship/workspace/team-dpdp-01')}
                    className="px-3 py-1.5 bg-[#202020] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                  >
                    Go to Team Workspace →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
