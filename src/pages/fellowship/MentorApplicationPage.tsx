/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Module 4: Mentor Application Workflow — HAQNAAMA Legal Research Fellowship
 */

import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck2,
  Building,
  Upload,
  BookOpen,
} from 'lucide-react';
import { MentorApplicationStatus } from '../../types/fellowship';

export const MentorApplicationPage: React.FC = () => {
  const { submitMentorApplication, mentorApplications, currentUserId } = useFellowship();
  const { navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [professionalRole, setProfessionalRole] = useState('Assistant Professor of Law');
  const [qualifications, setQualifications] = useState('LL.M. in Constitutional Law, Ph.D.');
  const [institutionalAffiliation, setInstitutionalAffiliation] = useState('');
  const [researchExpertise, setResearchExpertise] = useState('Constitutional Law, Administrative Law, Human Rights');
  const [publicationsPortfolio, setPublicationsPortfolio] = useState('');
  const [languages, setLanguages] = useState('English, Hindi');
  const [mentoringExperience, setMentoringExperience] = useState('');
  const [proposedResearchTopics, setProposedResearchTopics] = useState('');
  const [availabilityHours, setAvailabilityHours] = useState(5);
  const [maxTeamCapacity, setMaxTeamCapacity] = useState(1);
  const [conflictDeclaration, setConflictDeclaration] = useState('');
  const [professionalConduct, setProfessionalConduct] = useState(false);
  const [referencesCredentials, setReferencesCredentials] = useState('');

  // Credentials document summary
  const [credentialDocName, setCredentialDocName] = useState('Faculty_ID_or_Bar_Council_Enrolment.pdf');

  // Submission Status
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    appId?: string;
    error?: string;
  } | null>(null);

  const [trackQuery, setTrackQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!professionalConduct) {
      setSubmitResult({
        success: false,
        error: 'Please accept the mandatory professional conduct declaration before submitting.',
      });
      return;
    }

    if (!conflictDeclaration.trim()) {
      setSubmitResult({
        success: false,
        error: 'Please complete the conflict of interest declaration (or state "None declared").',
      });
      return;
    }

    const res = submitMentorApplication({
      mentorId: currentUserId || `mentor-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      professionalRole: professionalRole.trim(),
      qualifications: qualifications.trim(),
      institutionalAffiliation: institutionalAffiliation.trim(),
      researchExpertise: researchExpertise.split(',').map((s) => s.trim()).filter(Boolean),
      publicationsPortfolio: publicationsPortfolio.trim(),
      languages: languages.split(',').map((s) => s.trim()).filter(Boolean),
      mentoringExperience: mentoringExperience.trim(),
      proposedResearchTopics: proposedResearchTopics.trim(),
      availabilityHoursPerWeek: Number(availabilityHours),
      maxTeamCapacity: Number(maxTeamCapacity),
      conflictOfInterestDeclaration: conflictDeclaration.trim(),
      professionalConductDeclaration: professionalConduct,
      referencesCredentials: referencesCredentials.trim(),
    });

    setSubmitResult(res);
    if (res.success && res.id) {
      setTrackQuery(email.trim());
    }
  };

  const getStatusBadge = (status: MentorApplicationStatus, verified: boolean) => {
    if (status === 'APPROVED' && verified) {
      return (
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[11px] inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>VERIFIED & APPROVED</span>
        </span>
      );
    }
    switch (status) {
      case 'CREDENTIAL_CHECK':
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-md text-[11px]">CREDENTIAL CHECK</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-md text-[11px]">UNDER REVIEW</span>;
      case 'CONDITIONAL_APPROVAL':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-md text-[11px]">CONDITIONAL</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-md text-[11px]">REJECTED</span>;
      case 'SUBMITTED':
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 font-bold rounded-md text-[11px]">SUBMITTED</span>;
    }
  };

  const matchedApps = mentorApplications.filter(
    (m) =>
      trackQuery &&
      (m.email.toLowerCase().includes(trackQuery.trim().toLowerCase()) ||
        m.id.toLowerCase().includes(trackQuery.trim().toLowerCase()) ||
        m.name.toLowerCase().includes(trackQuery.trim().toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Stage 04 Mentor & Scholar Registration</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Research Mentor Application
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 leading-relaxed">
          Open to full-time law faculty, senior advocates, legal researchers, and postdoctoral scholars. Lead a dedicated team of 2–3 undergraduate student co-authors through a semester-long publication cycle.
        </p>
      </div>

      {/* Credential Verification Notice */}
      <div className="bg-[#202020] text-[#F4F0E6] rounded-xl p-4 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-[#F28C28]">
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Protocol Mandatory Disclosure</span>
        </div>
        <p className="text-[#F4F0E6]/80 leading-relaxed">
          Mentors are never labeled "verified" until university faculty affiliation or Bar Council credentials have been independently checked and recorded in the immutable audit log by programme coordinators.
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
          New Mentor Application
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-colors ${
            activeTab === 'track' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Track Verification Status
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
                    <span>Mentor Application Logged for Review!</span>
                  </div>
                  <p>
                    Application ID: <strong>{submitResult.appId}</strong>. Our academic coordinator will verify your institutional credentials before team allocation.
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

          {/* Section 1: Professional Background */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider border-b border-[#202020]/10 pb-1">
              1. Professional & Academic Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Full Name & Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Harish Chandra / Adv. Sunita Rao"
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
                  placeholder="e.g. h.chandra@university.ac.in"
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
                  placeholder="e.g. +91 94140 12345"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Institutional Affiliation *</label>
                <input
                  type="text"
                  required
                  value={institutionalAffiliation}
                  onChange={(e) => setInstitutionalAffiliation(e.target.value)}
                  placeholder="e.g. Faculty of Law, University of Rajasthan / High Court Bar"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Professional Role *</label>
                <input
                  type="text"
                  required
                  value={professionalRole}
                  onChange={(e) => setProfessionalRole(e.target.value)}
                  placeholder="e.g. Associate Professor / Senior Advocate / Postdoc Fellow"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Highest Academic Qualifications *</label>
                <input
                  type="text"
                  required
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. Ph.D. in Law, LL.M. (Gold Medalist)"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Research Portfolio & Proposed Topics */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider border-b border-[#202020]/10 pb-1">
              2. Research Expertise & Proposed Project Direction
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Areas of Research Expertise (comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={researchExpertise}
                  onChange={(e) => setResearchExpertise(e.target.value)}
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Publications & Research Portfolio *</label>
                <textarea
                  rows={3}
                  required
                  value={publicationsPortfolio}
                  onChange={(e) => setPublicationsPortfolio(e.target.value)}
                  placeholder="Cite 2–4 representative publications, monographs, or significant judicial pleadings (e.g. Journal of Indian Law Institute, SCC, etc.)"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Proposed Research Topic / Working Question *</label>
                <textarea
                  rows={3}
                  required
                  value={proposedResearchTopics}
                  onChange={(e) => setProposedResearchTopics(e.target.value)}
                  placeholder="Summarize the core research question you wish to explore with student co-authors this semester..."
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#202020] mb-1">Weekly Mentoring Availability (Hours) *</label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    required
                    value={availabilityHours}
                    onChange={(e) => setAvailabilityHours(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                  />
                  <p className="text-[10px] text-[#202020]/60 mt-0.5">Norm: 4–6 hours/week (weekly sync + draft review).</p>
                </div>

                <div>
                  <label className="block font-bold text-[#202020] mb-1">Team Capacity (Teams) *</label>
                  <select
                    value={maxTeamCapacity}
                    onChange={(e) => setMaxTeamCapacity(Number(e.target.value))}
                    className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-white font-medium"
                  >
                    <option value={1}>1 Research Team (2–3 Students) — Recommended</option>
                    <option value={2}>2 Research Teams (Maximum)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Credential Document Reference (Bar Roll / Faculty Profile URL / ID)</label>
                <input
                  type="text"
                  value={referencesCredentials}
                  onChange={(e) => setReferencesCredentials(e.target.value)}
                  placeholder="e.g. Bar Council Enrolment No. or Official Faculty Directory link"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Declarations and Academic Integrity */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider border-b border-[#202020]/10 pb-1">
              3. Conflict of Interest & Conduct Declarations
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Conflict of Interest Disclosure *</label>
                <textarea
                  rows={2}
                  required
                  value={conflictDeclaration}
                  onChange={(e) => setConflictDeclaration(e.target.value)}
                  placeholder="Disclose any active commercial retainers, political advisory roles, or pending litigation involving the proposed research subject (or state 'None declared')."
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg focus:border-[#F28C28] outline-hidden bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-[#202020]">
                <input
                  type="checkbox"
                  required
                  checked={professionalConduct}
                  onChange={(e) => setProfessionalConduct(e.target.checked)}
                  className="mt-0.5 rounded text-[#F28C28]"
                />
                <span>
                  I pledge to uphold academic ethics, provide fair and constructive feedback to student co-authors, adhere to pre-agreed authorship agreements, and comply with the zero-hallucination research mandate.
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-[#202020]/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-[#202020]/60">
              Mentor applications are independently verified before any research team is chartered.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Mentor Application</span>
            </button>
          </div>
        </form>
      ) : (
        /* Track Tab */
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#202020]">Track Mentor Credential Verification</h2>
            <p className="text-xs text-[#202020]/75">
              Enter your email or application ID to view credential check milestones and coordinator notes.
            </p>
          </div>

          <div className="flex gap-2 max-w-lg">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="e.g. v.rathore@nlujodhpur.ac.in or mentor-app-01"
              className="flex-1 p-2.5 border border-[#202020]/20 rounded-lg text-xs outline-hidden focus:border-[#F28C28]"
            />
          </div>

          {trackQuery && matchedApps.length === 0 && (
            <div className="p-4 bg-[#F4F0E6]/50 rounded-xl text-xs text-[#202020]/70 text-center">
              No mentor record found with this query.
            </div>
          )}

          {matchedApps.map((m) => (
            <div key={m.id} className="p-5 border border-[#202020]/15 rounded-xl space-y-4 bg-[#F4F0E6]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-[#202020]">{m.name}</h3>
                  <p className="text-xs text-[#202020]/70">{m.professionalRole} · {m.institutionalAffiliation}</p>
                </div>
                <div>{getStatusBadge(m.status, m.credentialsVerified)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#202020]/60 block text-[10px] uppercase font-bold">Credentials Check</span>
                  <span className={`font-semibold ${m.credentialsVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {m.credentialsVerified ? 'Verified by Academic Coordinator' : 'Pending Independent Check'}
                  </span>
                </div>
                <div>
                  <span className="text-[#202020]/60 block text-[10px] uppercase font-bold">Team Capacity</span>
                  <span className="font-medium text-[#202020]">{m.maxTeamCapacity} Team ({m.availabilityHoursPerWeek} hrs/week)</span>
                </div>
                <div>
                  <span className="text-[#202020]/60 block text-[10px] uppercase font-bold">COI Disclosure</span>
                  <span className="font-medium text-[#202020] line-clamp-1">{m.conflictOfInterestDeclaration}</span>
                </div>
              </div>

              {m.reviewerNotes && (
                <div className="p-3 bg-white border border-[#202020]/10 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-[#F28C28] text-[11px] uppercase tracking-wider block">
                    Coordinator Audit Note
                  </span>
                  <p className="text-[#202020]/80">{m.reviewerNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
