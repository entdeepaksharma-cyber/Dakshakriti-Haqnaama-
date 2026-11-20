/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Module 13: Programme Administration & Audit Engine — HAQNAAMA Legal Research Fellowship
 */

import React, { useState, useMemo } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Settings,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck2,
  Lock,
  ChevronRight,
  Eye,
  Check,
  X,
  PlayCircle,
} from 'lucide-react';
import { StudentApplicationStatus, MentorApplicationStatus } from '../../types/fellowship';

export const FellowshipAdminPage: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    config,
    updateConfig,
    studentApplications,
    updateStudentApplicationStatus,
    mentorApplications,
    verifyMentorCredentials,
    updateMentorApplicationStatus,
    projects,
    updateProjectStatus,
    teams,
    memberships,
    createResearchTeam,
    ethicsReviews,
    submitEthicsReview,
    manuscripts,
    publications,
    auditEvents,
    logAuditEvent,
  } = useFellowship();

  const { navigate } = useApp();

  const [activeTab, setActiveTab] = useState<
    'students' | 'mentors' | 'proposals' | 'teams' | 'ethics' | 'config' | 'audit'
  >('students');

  // Config editing state
  const [cycleName, setCycleName] = useState(config.currentCycleName);
  const [studentDeadline, setStudentDeadline] = useState(config.studentApplicationDeadline);
  const [mentorDeadline, setMentorDeadline] = useState(config.mentorApplicationDeadline);
  const [minStudents, setMinStudents] = useState(config.defaultMinStudentsPerTeam);
  const [maxStudents, setMaxStudents] = useState(config.defaultMaxStudentsPerTeam);
  const [configSaveMsg, setConfigSaveMsg] = useState(false);

  // Team Chartering state
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [charterTeamName, setCharterTeamName] = useState('New Research Group');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [charterResult, setCharterResult] = useState<{ success: boolean; error?: string } | null>(null);

  // Real computed metrics
  const metrics = useMemo(() => {
    return {
      totalStudentApps: studentApplications.length,
      acceptedStudents: studentApplications.filter((s) => s.status === 'ACCEPTED').length,
      totalMentorApps: mentorApplications.length,
      verifiedMentors: mentorApplications.filter((m) => m.credentialsVerified && m.status === 'APPROVED').length,
      activeProjects: projects.filter((p) => p.status === 'ACTIVE' || p.status === 'OPEN_FOR_APPLICATIONS').length,
      charteredTeams: teams.length,
      approvedEthics: ethicsReviews.filter((e) => e.status === 'APPROVED').length,
      publishedPapers: publications.length,
      totalAuditEvents: auditEvents.length,
    };
  }, [
    studentApplications,
    mentorApplications,
    projects,
    teams,
    ethicsReviews,
    publications,
    auditEvents,
  ]);

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateConfig({
      currentCycleName: cycleName,
      studentApplicationDeadline: studentDeadline,
      mentorApplicationDeadline: mentorDeadline,
      defaultMinStudentsPerTeam: Number(minStudents),
      defaultMaxStudentsPerTeam: Number(maxStudents),
    });
    if (success) {
      setConfigSaveMsg(true);
      setTimeout(() => setConfigSaveMsg(false), 3000);
    }
  };

  const handleCharterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCharterResult(null);

    const res = createResearchTeam(selectedProjectId, charterTeamName, selectedStudentIds);
    setCharterResult(res);
    if (res.success) {
      setSelectedStudentIds([]);
    }
  };

  const toggleStudentSelection = (applicantId: string) => {
    if (selectedStudentIds.includes(applicantId)) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== applicantId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, applicantId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#202020]/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-md text-xs font-bold text-[#F28C28] mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Module 13 & 16 Programme Administration & Security Engine</span>
          </div>
          <h1 className="text-3xl font-black text-[#202020]">
            HLRF Administration Console
          </h1>
          <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
            Admissions triage, mentor credential verification, research team chartering, ethics clearance queues, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/fellowship/tests')}
            className="px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>Run Test Suite (24)</span>
          </button>
        </div>
      </div>

      {/* Real Computed KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#202020]/60 font-semibold uppercase">
            <span>Student Admissions</span>
            <GraduationCap className="w-4 h-4 text-[#F28C28]" />
          </div>
          <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{metrics.totalStudentApps}</p>
          <p className="text-[11px] text-emerald-700 font-medium">
            {metrics.acceptedStudents} selected co-authors
          </p>
        </div>

        <div className="bg-white border border-[#202020]/15 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#202020]/60 font-semibold uppercase">
            <span>Verified Mentors</span>
            <Users className="w-4 h-4 text-[#F28C28]" />
          </div>
          <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{metrics.verifiedMentors}</p>
          <p className="text-[11px] text-[#202020]/70">
            {metrics.totalMentorApps} total applicants
          </p>
        </div>

        <div className="bg-white border border-[#202020]/15 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#202020]/60 font-semibold uppercase">
            <span>Chartered Teams</span>
            <BookOpen className="w-4 h-4 text-[#F28C28]" />
          </div>
          <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{metrics.charteredTeams}</p>
          <p className="text-[11px] text-[#202020]/70">
            {metrics.activeProjects} active proposals
          </p>
        </div>

        <div className="bg-white border border-[#202020]/15 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#202020]/60 font-semibold uppercase">
            <span>Audit Trail Events</span>
            <History className="w-4 h-4 text-[#F28C28]" />
          </div>
          <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{metrics.totalAuditEvents}</p>
          <p className="text-[11px] text-emerald-700 font-medium">100% Immutable</p>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-[#202020]/15 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'students' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Student Admissions ({studentApplications.length})
        </button>

        <button
          onClick={() => setActiveTab('mentors')}
          className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'mentors' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Mentor Credentials ({mentorApplications.length})
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'proposals' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Research Proposals ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'teams' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Team Formation ({teams.length})
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'config' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Programme Settings
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Audit Stream ({auditEvents.length})
        </button>
      </div>

      {/* SUBTAB 1: STUDENT ADMISSIONS */}
      {activeTab === 'students' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-[#202020]">Student Applicant Triage</h2>
              <p className="text-xs text-[#202020]/60">Evaluate undergraduate applicant profiles and manage admission status.</p>
            </div>
          </div>

          <div className="space-y-3">
            {studentApplications.map((app) => (
              <div
                key={app.id}
                className="p-5 border border-[#202020]/15 rounded-xl bg-[#F4F0E6]/30 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#202020]">{app.fullName}</h3>
                    <p className="text-xs text-[#202020]/70">
                      {app.university} · {app.degree} ({app.currentSemesterYear}) · {app.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[10px] uppercase text-[#202020]/60">Status:</span>
                    <span className="px-2.5 py-0.5 bg-[#202020] text-white rounded font-bold text-[10px]">
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-[10px] uppercase text-[#202020]/60 block">Interests & Skills</span>
                    <p>{app.areasOfLegalInterest.join(', ')}</p>
                    <p className="text-[11px] text-[#202020]/70 mt-1">Skills: {app.relevantSkills.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] uppercase text-[#202020]/60 block">Learning Goals & Experience</span>
                    <p className="line-clamp-2">{app.learningObjectives}</p>
                    <p className="text-[11px] text-[#202020]/70 mt-1">Availability: {app.availabilityHoursPerWeek} hrs/week</p>
                  </div>
                </div>

                {app.writingSampleTitle && (
                  <div className="p-2.5 bg-white border border-[#202020]/10 rounded-lg">
                    <span className="font-bold text-[10px] uppercase text-[#202020]/60 block">Writing Sample</span>
                    <p className="font-semibold">{app.writingSampleTitle}</p>
                    {app.writingSampleText && <p className="text-[11px] text-[#202020]/70 italic mt-0.5 line-clamp-2">"{app.writingSampleText}"</p>}
                  </div>
                )}

                <div className="pt-2 border-t border-[#202020]/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-[#202020]/50">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.status !== 'ACCEPTED' && (
                      <button
                        onClick={() => updateStudentApplicationStatus(app.id, 'ACCEPTED', 'Approved by coordinator for team chartering')}
                        className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold text-[10px]"
                      >
                        Accept
                      </button>
                    )}
                    {app.status !== 'INTERVIEW' && (
                      <button
                        onClick={() => updateStudentApplicationStatus(app.id, 'INTERVIEW', 'Scheduled for virtual panel interview')}
                        className="px-2.5 py-1 bg-blue-700 text-white rounded font-bold text-[10px]"
                      >
                        Schedule Interview
                      </button>
                    )}
                    {app.status !== 'WAITLISTED' && (
                      <button
                        onClick={() => updateStudentApplicationStatus(app.id, 'WAITLISTED', 'Placed on reserve list for matching')}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded font-bold text-[10px]"
                      >
                        Waitlist
                      </button>
                    )}
                    {app.status !== 'REJECTED' && (
                      <button
                        onClick={() => updateStudentApplicationStatus(app.id, 'REJECTED', 'Application not selected for this cycle')}
                        className="px-2.5 py-1 bg-rose-700 text-white rounded font-bold text-[10px]"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: MENTOR CREDENTIALS VERIFICATION */}
      {activeTab === 'mentors' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-[#202020]">Mentor Credential Verification Protocol</h2>
              <p className="text-xs text-[#202020]/60">
                Module 4 Verification Rule: Mentors must be independently confirmed via bar records or university faculty rosters.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mentorApplications.map((m) => (
              <div
                key={m.id}
                className="p-5 border border-[#202020]/15 rounded-xl bg-[#F4F0E6]/30 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#202020]">{m.name}</h3>
                    <p className="text-xs text-[#202020]/70">
                      {m.professionalRole} · {m.institutionalAffiliation} ({m.qualifications})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                        m.credentialsVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.credentialsVerified ? 'CREDENTIALS VERIFIED' : 'PENDING VERIFICATION'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-bold text-[10px] uppercase text-[#202020]/60 block">Research Portfolio</span>
                    <p className="text-[11px] text-[#202020]/80">{m.publicationsPortfolio}</p>
                    <p className="text-[10px] text-[#202020]/60 mt-1">Credentials ref: {m.referencesCredentials}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] uppercase text-[#202020]/60 block">Conflict of Interest Declaration</span>
                    <p className="text-[11px] text-[#202020]/80 italic">"{m.conflictOfInterestDeclaration}"</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#202020]/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-[#202020]/50">
                    {m.verifiedAt ? `Verified on ${m.verifiedAt} by ${m.verifiedBy}` : 'Verification pending'}
                  </span>
                  <div className="flex gap-2">
                    {!m.credentialsVerified ? (
                      <button
                        onClick={() => verifyMentorCredentials(m.id, true, 'Verified via institutional bar registry')}
                        className="px-3 py-1 bg-emerald-700 text-white rounded font-bold text-[10px]"
                      >
                        Verify Credentials & Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => verifyMentorCredentials(m.id, false, 'Revoked for re-check')}
                        className="px-3 py-1 bg-amber-600 text-white rounded font-bold text-[10px]"
                      >
                        Revoke Verification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PROPOSALS REVIEW */}
      {activeTab === 'proposals' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-bold text-[#202020]">Research Proposals Review Queue</h2>
              <p className="text-xs text-[#202020]/60">Evaluate mentor-submitted research questions before opening for student matching.</p>
            </div>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 border border-[#202020]/15 rounded-xl bg-[#F4F0E6]/30 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#202020]">{proj.title}</h3>
                    <p className="text-xs text-[#202020]/70">Lead Mentor: {proj.mentorName} · {proj.legalSubject}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#202020] text-white rounded font-bold text-[10px]">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-[#202020]/80">{proj.abstract}</p>

                <div className="pt-2 border-t border-[#202020]/10 flex justify-end gap-2">
                  {proj.status !== 'OPEN_FOR_APPLICATIONS' && (
                    <button
                      onClick={() => updateProjectStatus(proj.id, 'OPEN_FOR_APPLICATIONS', 'Approved and opened for student matching')}
                      className="px-3 py-1 bg-emerald-700 text-white font-bold rounded text-[10px]"
                    >
                      Open for Student Applications
                    </button>
                  )}
                  {proj.status !== 'REVISION_REQUIRED' && (
                    <button
                      onClick={() => updateProjectStatus(proj.id, 'REVISION_REQUIRED', 'Please refine scope of statutory provisions')}
                      className="px-3 py-1 bg-amber-600 text-white font-bold rounded text-[10px]"
                    >
                      Request Revisions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: TEAM FORMATION & MATCHING */}
      {activeTab === 'teams' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-[#202020]">Charter Research Team & Enforce Size Policy</h2>
            <p className="text-xs text-[#202020]/60">
              Module 7 Rule: Each research team must contain exactly 1 approved mentor and {config.defaultMinStudentsPerTeam}–{config.defaultMaxStudentsPerTeam} student co-authors.
            </p>
          </div>

          {charterResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                charterResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                  : 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
              }`}
            >
              {charterResult.success ? 'Research team chartered successfully! Private workspace created.' : charterResult.error}
            </div>
          )}

          <form onSubmit={handleCharterSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Select Approved Project *</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Mentor: {p.mentorName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Team Designation Name *</label>
                <input
                  type="text"
                  required
                  value={charterTeamName}
                  onChange={(e) => setCharterTeamName(e.target.value)}
                  placeholder="e.g. Constitutional Privacy & Welfare Group"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">
                Select Student Co-Authors (Must pick {config.defaultMinStudentsPerTeam}–{config.defaultMaxStudentsPerTeam}) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 border rounded-xl bg-[#F4F0E6]/30">
                {studentApplications.map((stud) => {
                  const isSelected = selectedStudentIds.includes(stud.applicantId);
                  return (
                    <div
                      key={stud.id}
                      onClick={() => toggleStudentSelection(stud.applicantId)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between ${
                        isSelected ? 'bg-[#202020] text-white border-[#202020]' : 'bg-white border-[#202020]/15'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{stud.fullName}</p>
                        <p className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-[#202020]/60'}`}>
                          {stud.university} ({stud.degree})
                        </p>
                      </div>
                      <span className="text-[10px] font-bold">{isSelected ? 'SELECTED' : '+ SELECT'}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-[#202020]/60 mt-1">
                Currently Selected: <strong>{selectedStudentIds.length}</strong> students (Policy allows {config.defaultMinStudentsPerTeam}–{config.defaultMaxStudentsPerTeam}).
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold rounded-lg"
            >
              Charter Team & Open Workspace
            </button>
          </form>

          {/* Active Teams List */}
          <div className="pt-4 border-t space-y-3">
            <h3 className="font-bold text-xs uppercase text-[#202020]">Active Chartered Teams</h3>
            <div className="space-y-2">
              {teams.map((t) => (
                <div key={t.id} className="p-3 bg-[#FDF3E7] rounded-lg border border-[#F28C28]/20 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#202020]">{t.teamName}</p>
                    <p className="text-[11px] text-[#202020]/70">Lead Mentor: {t.mentorName} · {t.projectTitle}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/fellowship/workspace/${t.id}`)}
                    className="px-3 py-1 bg-[#202020] text-white rounded font-bold text-[11px]"
                  >
                    Open Workspace →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: PROGRAMME CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-[#202020]">Configurable Programme Parameters</h2>
            <p className="text-xs text-[#202020]/60">
              Module 1 Rule: All deadlines and eligibility limits must be configurable by authorized administrators.
            </p>
          </div>

          {configSaveMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold">
              Programme parameters saved and updated across all public views!
            </div>
          )}

          <form onSubmit={handleConfigSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Current Academic Cycle Name *</label>
                <input
                  type="text"
                  required
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Student Application Deadline *</label>
                <input
                  type="date"
                  required
                  value={studentDeadline}
                  onChange={(e) => setStudentDeadline(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Mentor Application Deadline *</label>
                <input
                  type="date"
                  required
                  value={mentorDeadline}
                  onChange={(e) => setMentorDeadline(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Min Students / Team</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={minStudents}
                    onChange={(e) => setMinStudents(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Max Students / Team</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#202020] hover:bg-black text-white font-bold rounded-lg text-xs"
              >
                Save Programme Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 6: AUDIT STREAM */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b pb-3">
            <h2 className="text-base font-bold text-[#202020]">Immutable Security & Operational Audit Log</h2>
            <p className="text-xs text-[#202020]/60">
              Module 16 Compliance: Tracks every administrative decision, verification check, team chartering, and role transition.
            </p>
          </div>

          <div className="space-y-2 font-mono text-[11px] max-h-96 overflow-y-auto">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="p-3 bg-[#F4F0E6]/50 rounded-lg border border-[#202020]/10 space-y-1">
                <div className="flex items-center justify-between text-[#202020]/60 text-[10px]">
                  <span>{new Date(evt.timestamp).toLocaleString()}</span>
                  <span className="font-bold text-[#F28C28]">{evt.actorRole}</span>
                </div>
                <div className="font-bold text-[#202020]">
                  {evt.action} <span className="text-[#202020]/50">[{evt.targetEntity}]</span>
                </div>
                <p className="text-[#202020]/80">{evt.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
