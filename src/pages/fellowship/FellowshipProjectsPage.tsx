/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modules 5 & 6: Research Project Proposals & Student Matching — HAQNAAMA Legal Research Fellowship
 */

import React, { useState, useMemo } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Filter,
  Search,
  Users,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  FileText,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { ResearchProject, ExpectedResearchOutput } from '../../types/fellowship';

export const FellowshipProjectsPage: React.FC = () => {
  const {
    projects,
    submitProjectProposal,
    applyToProject,
    activeRole,
    currentUserId,
    currentUserName,
    config,
  } = useFellowship();
  const { navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected project for detailed modal
  const [detailProject, setDetailProject] = useState<ResearchProject | null>(null);

  // Apply Modal
  const [applyModalProject, setApplyModalProject] = useState<ResearchProject | null>(null);
  const [studentStatement, setStudentStatement] = useState('');
  const [studentSkills, setStudentSkills] = useState('Statutory interpretation, Case analysis, Bluebook citation');
  const [applyResult, setApplyResult] = useState<{ success: boolean; error?: string } | null>(null);

  // Proposal Creation Modal (Mentors / Admins)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newResearchQuestion, setNewResearchQuestion] = useState('');
  const [newObjectives, setNewObjectives] = useState('');
  const [newSubject, setNewSubject] = useState('Constitutional Law');
  const [newJurisdiction, setNewJurisdiction] = useState('Republic of India');
  const [newMethodology, setNewMethodology] = useState('Doctrinal statutory & constitutional analysis');
  const [newLiterature, setNewLiterature] = useState('');
  const [newContribution, setNewContribution] = useState('');
  const [newExpectedOutput, setNewExpectedOutput] = useState<ExpectedResearchOutput>('journal_article');
  const [newDuration, setNewDuration] = useState(6);
  const [newSkills, setNewSkills] = useState('Constitutional law research, Statutory analysis');
  const [newEthicalNotes, setNewEthicalNotes] = useState('Strict compliance with HAQNAAMA research ethics policy');
  const [newHumanParticipants, setNewHumanParticipants] = useState(false);
  const [newPersonalData, setNewPersonalData] = useState('Public reported judgments and statutes only');
  const [newCoi, setNewCoi] = useState('None declared');
  const [newPubGoals, setNewPubGoals] = useState('Peer-reviewed UGC-CARE Indian Law Review');
  const [proposalSubmitResult, setProposalSubmitResult] = useState<{ success: boolean; error?: string } | null>(null);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.researchQuestion.toLowerCase().includes(q) ||
        p.mentorName.toLowerCase().includes(q);

      const matchSubject =
        selectedSubject === 'all' || p.legalSubject.toLowerCase().includes(selectedSubject.toLowerCase());

      const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;

      return matchSearch && matchSubject && matchStatus;
    });
  }, [projects, searchQuery, selectedSubject, selectedStatus]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalProject) return;

    const skills = studentSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const res = applyToProject(applyModalProject.id, studentStatement.trim(), skills);
    setApplyResult(res);
    if (res.success) {
      setStudentStatement('');
    }
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSubmitResult(null);

    const res = submitProjectProposal({
      title: newTitle.trim(),
      abstract: newAbstract.trim(),
      researchQuestion: newResearchQuestion.trim(),
      objectives: newObjectives.split('\n').map((s) => s.trim()).filter(Boolean),
      legalSubject: newSubject.trim(),
      jurisdiction: newJurisdiction.trim(),
      methodology: newMethodology.trim(),
      existingLiteratureSummary: newLiterature.trim(),
      proposedContribution: newContribution.trim(),
      expectedOutput: newExpectedOutput,
      estimatedDurationMonths: Number(newDuration),
      studentSkillsRequired: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      languages: ['English', 'Hindi'],
      sourceAvailabilityNotes: 'Official primary sources available on India Code & NJDG',
      ethicalConsiderations: newEthicalNotes.trim(),
      humanParticipantsInvolved: newHumanParticipants,
      personalDataConsiderations: newPersonalData.trim(),
      conflictOfInterestDisclosures: newCoi.trim(),
      publicationGoals: newPubGoals.trim(),
      mentorId: currentUserId,
      mentorName: currentUserName,
      mentorCapacity: 3,
      cycleId: 'cycle-2026-a',
    });

    setProposalSubmitResult(res);
    if (res.success) {
      setShowCreateModal(false);
      setNewTitle('');
      setNewAbstract('');
      setNewResearchQuestion('');
    }
  };

  const getStatusBadge = (status: ResearchProject['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">ACTIVE TEAM</span>;
      case 'OPEN_FOR_APPLICATIONS':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">OPEN FOR APPLICANTS</span>;
      case 'TEAM_FORMED':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded">TEAM CHARTERED</span>;
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">UNDER REVIEW</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold rounded">COMPLETED</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-md text-xs font-bold text-[#F28C28] mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Stage 05 & 06 Research Projects & Matching</span>
          </div>
          <h1 className="text-3xl font-black text-[#202020]">
            Legal Research Project Proposals
          </h1>
          <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
            Explore approved semester-long research questions led by faculty and advocate mentors. Undergraduate law students can apply directly to join co-authorship teams.
          </p>
        </div>

        {/* Propose Button for Mentors/Admins */}
        {(activeRole === 'APPROVED_MENTOR' ||
          activeRole === 'RESEARCH_COORDINATOR' ||
          activeRole === 'PROGRAM_ADMIN') && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Research Proposal</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#202020]/50 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, statute or mentor..."
            className="w-full pl-9 pr-3 py-2 border border-[#202020]/20 rounded-lg text-xs outline-hidden focus:border-[#F28C28]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#202020]/60" />
            <span className="font-semibold text-[#202020]/70">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="p-1.5 border border-[#202020]/20 rounded-md bg-white font-medium outline-hidden"
            >
              <option value="all">All Subjects</option>
              <option value="Constitutional">Constitutional Law</option>
              <option value="Revenue">Agrarian & Revenue Law</option>
              <option value="Criminal">Criminal Procedure</option>
              <option value="Consumer">Consumer & Competition</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#202020]/70">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 border border-[#202020]/20 rounded-md bg-white font-medium outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="OPEN_FOR_APPLICATIONS">Open for Applications</option>
              <option value="ACTIVE">Active Teams</option>
              <option value="TEAM_FORMED">Team Formed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#F28C28] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-[#F28C28] tracking-wider">
                  {p.legalSubject}
                </span>
                {getStatusBadge(p.status)}
              </div>

              <h2 className="text-base font-bold text-[#202020] leading-snug line-clamp-2">
                {p.title}
              </h2>

              <p className="text-xs text-[#202020]/75 line-clamp-3 leading-relaxed">
                {p.abstract}
              </p>

              <div className="p-3 bg-[#F4F0E6]/50 rounded-xl border border-[#202020]/10 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#202020]/60 block">Core Research Question</span>
                <p className="font-medium text-[#202020] italic line-clamp-2">"{p.researchQuestion}"</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#202020]/70 pt-1">
                <Users className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Mentor: <strong>{p.mentorName}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#202020]/10 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setDetailProject(p)}
                className="text-[#202020] hover:text-[#F28C28] font-bold underline"
              >
                Inspect Proposal →
              </button>

              {p.status === 'OPEN_FOR_APPLICATIONS' || p.status === 'ACTIVE' ? (
                <button
                  onClick={() => {
                    setApplyModalProject(p);
                    setApplyResult(null);
                  }}
                  className="px-3 py-1.5 bg-[#202020] hover:bg-black text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#F28C28]" />
                  <span>Apply to Team</span>
                </button>
              ) : (
                <span className="text-[11px] text-[#202020]/50 font-medium">Applications Closed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center bg-white border border-[#202020]/15 rounded-2xl text-xs text-[#202020]/60">
          No research projects match the specified query and filters.
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#202020]/20 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                  {detailProject.legalSubject} · {detailProject.jurisdiction}
                </span>
                <h2 className="text-xl font-black text-[#202020] mt-1">{detailProject.title}</h2>
                <p className="text-xs text-[#202020]/70 mt-1">Lead Mentor: <strong>{detailProject.mentorName}</strong></p>
              </div>
              <button onClick={() => setDetailProject(null)} className="p-1.5 rounded-lg hover:bg-black/5">
                <X className="w-5 h-5 text-[#202020]" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#202020]/85 leading-relaxed">
              <div>
                <h3 className="font-bold text-[#202020] uppercase text-[11px] mb-1">Abstract</h3>
                <p className="bg-[#F4F0E6]/30 p-3 rounded-lg border border-[#202020]/10">{detailProject.abstract}</p>
              </div>

              <div>
                <h3 className="font-bold text-[#202020] uppercase text-[11px] mb-1">Research Question</h3>
                <p className="p-3 bg-[#FDF3E7] rounded-lg border border-[#F28C28]/30 font-medium text-[#202020]">
                  {detailProject.researchQuestion}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[#202020] uppercase text-[11px] mb-1">Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {detailProject.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#F4F0E6]/50 rounded-lg border border-[#202020]/10">
                  <span className="font-bold block text-[10px] uppercase text-[#202020]/60">Methodology</span>
                  <span>{detailProject.methodology}</span>
                </div>
                <div className="p-3 bg-[#F4F0E6]/50 rounded-lg border border-[#202020]/10">
                  <span className="font-bold block text-[10px] uppercase text-[#202020]/60">Expected Output</span>
                  <span className="capitalize">{detailProject.expectedOutput.replace('_', ' ')} (est. {detailProject.estimatedDurationMonths} months)</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#202020] uppercase text-[11px] mb-1">Skills Desired from Student Co-Authors</h3>
                <div className="flex flex-wrap gap-1.5">
                  {detailProject.studentSkillsRequired.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-white border border-[#202020]/20 rounded-md font-semibold text-[11px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#202020] uppercase text-[11px] mb-1">Ethical & Personal Data Considerations</h3>
                <p className="text-[#202020]/75">{detailProject.ethicalConsiderations} · {detailProject.personalDataConsiderations}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#202020]/10 flex justify-end gap-3">
              <button
                onClick={() => setDetailProject(null)}
                className="px-4 py-2 border border-[#202020]/20 rounded-lg text-xs font-bold text-[#202020]"
              >
                Close
              </button>
              {(detailProject.status === 'OPEN_FOR_APPLICATIONS' || detailProject.status === 'ACTIVE') && (
                <button
                  onClick={() => {
                    setApplyModalProject(detailProject);
                    setDetailProject(null);
                  }}
                  className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white rounded-lg text-xs font-bold"
                >
                  Apply to this Team
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT APPLICATION TO PROJECT MODAL (Module 6 Matching) */}
      {applyModalProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#202020]/20 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider">
                  Module 6 Student-Project Application
                </span>
                <h2 className="text-base font-bold text-[#202020]">{applyModalProject.title}</h2>
                <p className="text-xs text-[#202020]/70">Lead Mentor: {applyModalProject.mentorName}</p>
              </div>
              <button onClick={() => setApplyModalProject(null)} className="p-1 rounded-lg hover:bg-black/5">
                <X className="w-5 h-5 text-[#202020]" />
              </button>
            </div>

            {applyResult ? (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  applyResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {applyResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Application Logged for Coordinator Review!</span>
                    </div>
                    <p>
                      Your interest in <strong>{applyModalProject.title}</strong> has been forwarded to the Programme Coordinator.
                    </p>
                    <div className="p-2.5 bg-white/80 rounded border border-emerald-300 text-[11px]">
                      <strong>Advisory Criteria Check:</strong> Your profile matched project research prerequisites. Final selection is human-reviewed by coordinators without algorithmic discrimination.
                    </div>
                  </div>
                ) : (
                  <p className="font-semibold">{applyResult.error}</p>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => setApplyModalProject(null)}
                    className="px-4 py-2 bg-[#202020] text-white rounded-lg text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#202020] mb-1">
                    Your Statement of Interest & Research Motivation *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={studentStatement}
                    onChange={(e) => setStudentStatement(e.target.value)}
                    placeholder="Explain why this research question interests you, any relevant courses taken, and how you will contribute to co-authoring the paper..."
                    className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#202020] mb-1">
                    Your Relevant Skills for this Project (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentSkills}
                    onChange={(e) => setStudentSkills(e.target.value)}
                    className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                  />
                  <p className="text-[10px] text-[#202020]/60 mt-0.5">
                    Required by project: {applyModalProject.studentSkillsRequired.join(', ')}
                  </p>
                </div>

                <div className="p-3 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-xl text-[11px] text-[#202020]/80 space-y-1">
                  <span className="font-bold block text-[#F28C28]">Human Governance Safeguard:</span>
                  <p>
                    Advisory matching scores provide comparative skill summaries, but all admission and matching decisions are made by human programme coordinators and mentors.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalProject(null)}
                    className="px-4 py-2 border border-[#202020]/20 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white rounded-lg font-bold"
                  >
                    Submit Team Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PROPOSE NEW PROJECT MODAL (Module 5) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#202020]/20 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                  Module 5 Research Project Proposal
                </span>
                <h2 className="text-xl font-black text-[#202020]">Submit New Research Project Proposal</h2>
                <p className="text-xs text-[#202020]/70 mt-1">
                  Proposals undergo coordinator review before being opened for student co-author matching.
                </p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-black/5">
                <X className="w-5 h-5 text-[#202020]" />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Algorithmic Bias in Police Bail Oppositions: An Empirical Study"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Core Research Question *</label>
                <input
                  type="text"
                  required
                  value={newResearchQuestion}
                  onChange={(e) => setNewResearchQuestion(e.target.value)}
                  placeholder="e.g. Does the use of automated facial recognition violate Section 41A of the CrPC/BNSS?"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Abstract *</label>
                <textarea
                  rows={3}
                  required
                  value={newAbstract}
                  onChange={(e) => setNewAbstract(e.target.value)}
                  placeholder="Comprehensive summary of the problem, legal tension, and analytical goals..."
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Research Objectives (one per line) *</label>
                <textarea
                  rows={3}
                  required
                  value={newObjectives}
                  onChange={(e) => setNewObjectives(e.target.value)}
                  placeholder="1. Map statutory powers under...\n2. Review reported judgments from High Courts...\n3. Formulate procedural safeguards..."
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#202020] mb-1">Legal Subject *</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#202020] mb-1">Jurisdiction *</label>
                  <input
                    type="text"
                    required
                    value={newJurisdiction}
                    onChange={(e) => setNewJurisdiction(e.target.value)}
                    className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#202020] mb-1">Expected Output *</label>
                  <select
                    value={newExpectedOutput}
                    onChange={(e) => setNewExpectedOutput(e.target.value as any)}
                    className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-white font-medium"
                  >
                    <option value="journal_article">Journal Article</option>
                    <option value="working_paper">Working Paper</option>
                    <option value="legal_research_report">Legal Research Report</option>
                    <option value="case_comment">Case Comment</option>
                    <option value="policy_brief">Policy Brief</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#202020] mb-1">Skills Required from Student Co-Authors *</label>
                <input
                  type="text"
                  required
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="e.g. Criminal law research, Statutory analysis, Bluebook citations"
                  className="w-full p-2.5 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28] bg-[#F4F0E6]/20 font-medium"
                />
              </div>

              <div className="p-3 bg-[#202020] text-[#F4F0E6] rounded-xl text-xs space-y-1">
                <span className="font-bold text-[#F28C28]">Review Policy Reminder:</span>
                <p className="text-[#F4F0E6]/80">
                  Submitting a proposal does not automatically approve it. The Research Coordination Committee evaluates originality, methodology, and ethical compliance before opening it for student applicants.
                </p>
              </div>

              <div className="pt-3 border-t border-[#202020]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#202020]/20 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold rounded-lg"
                >
                  Submit Proposal for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
