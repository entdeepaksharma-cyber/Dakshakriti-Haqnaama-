/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Modules 7, 8, 9, 10, 11: Collaborative Team Research Workspace — HAQNAAMA Legal Research Fellowship
 */

import React, { useState, useMemo } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  ShieldCheck,
  AlertTriangle,
  History,
  Download,
  MessageSquare,
  Plus,
  Scale,
  Award,
  Lock,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  FileCheck2,
  Tag,
} from 'lucide-react';
import {
  ManuscriptLifecycleStage,
  SourceType,
  SourceVerificationStatus,
} from '../../types/fellowship';

interface Props {
  teamId?: string;
}

export const TeamWorkspacePage: React.FC<Props> = ({ teamId: propTeamId }) => {
  const {
    teams,
    memberships,
    projects,
    milestones,
    tasks,
    meetings,
    sources,
    citations,
    manuscripts,
    manuscriptVersions,
    manuscriptComments,
    ethicsReviews,
    authorshipAgreements,
    contributorRoles,
    checkTeamAccess,
    addMilestone,
    updateMilestoneStatus,
    addTask,
    updateTaskStatus,
    scheduleMeeting,
    addResearchSource,
    updateSourceVerification,
    saveManuscriptDraft,
    updateManuscriptStage,
    addManuscriptComment,
    resolveManuscriptComment,
    signAuthorshipAgreement,
    activeRole,
    currentUserId,
    currentUserName,
  } = useFellowship();

  const { navigate, routeQuery } = useApp();

  const activeTeamId = propTeamId || routeQuery.get('team') || teams[0]?.id || 'team-dpdp-01';

  // Security & Cross-Team Isolation Check
  const access = useMemo(() => {
    return checkTeamAccess(activeTeamId);
  }, [activeTeamId, checkTeamAccess]);

  const activeTeam = useMemo(() => {
    return teams.find((t) => t.id === activeTeamId) || teams[0];
  }, [teams, activeTeamId]);

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeTeam?.projectId) || projects[0];
  }, [projects, activeTeam]);

  const teamMembers = useMemo(() => {
    return memberships.filter((m) => m.teamId === activeTeamId);
  }, [memberships, activeTeamId]);

  const teamMilestones = useMemo(() => {
    return milestones.filter((m) => m.teamId === activeTeamId).sort((a, b) => a.orderIndex - b.orderIndex);
  }, [milestones, activeTeamId]);

  const teamTasks = useMemo(() => {
    return tasks.filter((t) => t.teamId === activeTeamId);
  }, [tasks, activeTeamId]);

  const teamSources = useMemo(() => {
    return sources.filter((s) => s.teamId === activeTeamId);
  }, [sources, activeTeamId]);

  const activeManuscript = useMemo(() => {
    return manuscripts.find((m) => m.teamId === activeTeamId) || manuscripts[0];
  }, [manuscripts, activeTeamId]);

  const activeEthics = useMemo(() => {
    return ethicsReviews.find((e) => e.teamId === activeTeamId);
  }, [ethicsReviews, activeTeamId]);

  const activeAgreement = useMemo(() => {
    return authorshipAgreements.find((a) => a.teamId === activeTeamId);
  }, [authorshipAgreements, activeTeamId]);

  const activeRoles = useMemo(() => {
    return contributorRoles.filter((r) => r.teamId === activeTeamId);
  }, [contributorRoles, activeTeamId]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'sources' | 'manuscript' | 'ethics'>(
    'overview'
  );

  // Manuscript Editor State
  const [editorContent, setEditorContent] = useState<string>(activeManuscript?.content || '');
  const [changeSummary, setChangeSummary] = useState('');
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; conflict?: boolean; message?: string } | null>(
    null
  );
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSection, setCommentSection] = useState('General');

  // Source Modal State
  const [showAddSource, setShowAddSource] = useState(false);
  const [newSrcTitle, setNewSrcTitle] = useState('');
  const [newSrcAuthor, setNewSrcAuthor] = useState('');
  const [newSrcDate, setNewSrcDate] = useState('');
  const [newSrcType, setNewSrcType] = useState<SourceType>('case_law');
  const [newSrcMeta, setNewSrcMeta] = useState('');
  const [newSrcPin, setNewSrcPin] = useState('');
  const [newSrcNotes, setNewSrcNotes] = useState('');
  const [newSrcIsPrimary, setNewSrcIsPrimary] = useState(true);

  // Task Modal State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('2026-11-01');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUserName);

  // Meeting Modal State
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('Weekly Research Sync');
  const [meetingTime, setMeetingTime] = useState('2026-10-24T17:00');
  const [meetingAgenda, setMeetingAgenda] = useState('Review Section II statutory arguments and primary citations');

  // Manuscript stages sequence
  const lifecycleStages: ManuscriptLifecycleStage[] = [
    'RESEARCH_PLAN',
    'LITERATURE_REVIEW',
    'SOURCE_COLLECTION',
    'FIRST_DRAFT',
    'MENTOR_REVIEW',
    'REVISION',
    'CITATION_CHECK',
    'ETHICS_CHECK',
    'FINAL_TEAM_APPROVAL',
    'EDITORIAL_REVIEW',
    'SUBMISSION_PREPARATION',
    'EXTERNAL_SUBMISSION',
    'ACCEPTED',
  ];

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(null);
    if (!activeManuscript) return;

    const res = saveManuscriptDraft(
      activeManuscript.id,
      editorContent,
      changeSummary,
      activeManuscript.currentVersionNumber
    );

    if (res.success) {
      setSaveStatus({
        success: true,
        message: `Saved Version ${res.newVersion} successfully with full audit trail!`,
      });
      setChangeSummary('');
    } else {
      setSaveStatus({
        success: false,
        conflict: res.conflict,
        message: res.error || 'Failed to save manuscript changes.',
      });
    }
  };

  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrcTitle.trim() || !newSrcAuthor.trim()) return;

    addResearchSource({
      teamId: activeTeamId,
      title: newSrcTitle.trim(),
      authorOrInstitution: newSrcAuthor.trim(),
      publicationDate: newSrcDate.trim() || '2023',
      jurisdiction: 'Republic of India',
      sourceType: newSrcType,
      citationMetadata: newSrcMeta.trim(),
      accessDate: new Date().toISOString().split('T')[0],
      relevantPageOrParagraph: newSrcPin.trim(),
      researcherNotes: newSrcNotes.trim(),
      verificationStatus: newSrcIsPrimary ? 'VERIFIED_PRIMARY' : 'VERIFIED_SECONDARY',
      isPrimarySource: newSrcIsPrimary,
    });

    setShowAddSource(false);
    setNewSrcTitle('');
    setNewSrcAuthor('');
    setNewSrcMeta('');
    setNewSrcPin('');
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      teamId: activeTeamId,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      dueDate: newTaskDue,
      assignedToName: newTaskAssignee,
      status: 'TODO',
      priority: 'MEDIUM',
    });

    setShowAddTask(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleScheduleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMeeting({
      teamId: activeTeamId,
      meetingTitle,
      scheduledAt: meetingTime,
      agenda: meetingAgenda,
      attendees: teamMembers.map((m) => m.userName),
    });
    setShowScheduleMeeting(false);
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeManuscript) return;

    addManuscriptComment({
      manuscriptId: activeManuscript.id,
      authorId: currentUserId,
      authorName: currentUserName,
      authorRole: activeRole,
      section: commentSection,
      commentText: newCommentText.trim(),
      resolved: false,
    });

    setNewCommentText('');
    setShowAddComment(false);
  };

  const exportManuscript = () => {
    if (!activeManuscript) return;
    const blob = new Blob([activeManuscript.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTeam.teamName.replace(/\s+/g, '_')}_Manuscript_v${activeManuscript.currentVersionNumber}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If user does not have access and is not an admin/coordinator, show strict isolation boundary
  if (!access.hasAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[#202020]">Cross-Team Document Isolation Guard</h1>
          <p className="text-xs text-[#202020]/75 max-w-lg mx-auto leading-relaxed">
            Module 16 Privacy & Safety Enforcement: Research team workspaces, working draft manuscripts, and reviewer notes are strictly confidential to authorized team members and programme reviewers.
          </p>
        </div>

        <div className="p-4 bg-[#F4F0E6] border border-[#202020]/15 rounded-xl max-w-md mx-auto text-xs text-left space-y-2">
          <p><strong>Your Active Role:</strong> {activeRole.replace('_', ' ')}</p>
          <p><strong>Team Requested:</strong> {activeTeam?.teamName || activeTeamId}</p>
          <p className="text-[11px] text-[#202020]/60">
            To inspect this workspace, switch to an authorized role (e.g. <code>APPROVED_MENTOR</code>, <code>APPROVED_STUDENT</code>, <code>RESEARCH_COORDINATOR</code>, or <code>PROGRAM_ADMIN</code>) using the top role switcher.
          </p>
        </div>

        <button
          onClick={() => navigate('/fellowship/projects')}
          className="px-5 py-2.5 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg"
        >
          Return to Public Projects Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Team Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#202020]/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
              Collaborative Research Team Workspace
            </span>
            {access.isAdminReviewer && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-[10px] font-bold">
                Coordinator Oversight Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202020]">
            {activeTeam.teamName}
          </h1>
          <p className="text-xs sm:text-sm text-[#202020]/75 max-w-2xl">
            {activeProject.title}
          </p>
        </div>

        {/* Team Selector if multiple teams exist */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#202020]/70">Active Team:</span>
          <select
            value={activeTeamId}
            onChange={(e) => navigate(`/fellowship/workspace/${e.target.value}`)}
            className="p-2 border border-[#202020]/20 rounded-lg text-xs font-bold bg-white outline-hidden focus:border-[#F28C28]"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.teamName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Manuscript Lifecycle Stage Stepper */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider">
            Manuscript Lifecycle Stage
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 bg-[#FDF3E7] text-[#F28C28] border border-[#F28C28]/30 rounded">
            Current: {activeManuscript?.currentStage.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[10px] font-bold">
          {lifecycleStages.map((stage, idx) => {
            const currentIdx = lifecycleStages.indexOf(activeManuscript?.currentStage || 'RESEARCH_PLAN');
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div
                key={stage}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-[#202020] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    : 'bg-[#F4F0E6]/50 text-[#202020]/50 border border-[#202020]/10'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 text-emerald-700" /> : <span>{idx + 1}.</span>}
                <span>{stage.replace(/_/g, ' ')}</span>
              </div>
            );
          })}
        </div>

        {(access.isLeadMentor || access.isAdminReviewer) && (
          <div className="flex items-center justify-between pt-2 border-t border-[#202020]/10 text-xs">
            <span className="text-[#202020]/60">Mentor Privilege: Advance manuscript lifecycle milestone</span>
            <div className="flex gap-2">
              <select
                value={activeManuscript?.currentStage}
                onChange={(e) => updateManuscriptStage(activeManuscript.id, e.target.value as any)}
                className="p-1 border border-[#202020]/20 rounded bg-white text-xs font-semibold"
              >
                {lifecycleStages.map((st) => (
                  <option key={st} value={st}>
                    Move to: {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#202020]/15 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'overview' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Overview & Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'milestones' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Milestones & Meetings</span>
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'sources' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Source Library & Citations ({teamSources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manuscript')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'manuscript' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Manuscript Drafting (v{activeManuscript?.currentVersionNumber})</span>
        </button>

        <button
          onClick={() => setActiveTab('ethics')}
          className={`py-2 px-4 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'ethics' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ethics & Authorship Agreement</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & TASKS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            {/* Team Members Card */}
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider">
                Research Team Roster
              </h2>
              <div className="space-y-3">
                {teamMembers.map((m) => (
                  <div key={m.id} className="p-3 bg-[#F4F0E6]/40 rounded-xl border border-[#202020]/10 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#202020]">{m.userName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.userRoleInTeam === 'MENTOR'
                            ? 'bg-[#FDF3E7] text-[#F28C28] border border-[#F28C28]/30'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {m.userRoleInTeam.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#202020]/60">{m.userEmail}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 space-y-1">
                <span className="font-bold block">Team Size Policy Compliant:</span>
                <p>1 Approved Mentor + 2 Selected Student Co-authors (Standard Model).</p>
              </div>
            </div>

            {/* Quick Meetings Card */}
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider">
                  Upcoming Meetings
                </h3>
                <button
                  onClick={() => setShowScheduleMeeting(true)}
                  className="text-[11px] font-bold text-[#F28C28] hover:underline"
                >
                  + Schedule
                </button>
              </div>

              <div className="space-y-2">
                {meetings.filter((m) => m.teamId === activeTeamId).length === 0 ? (
                  <p className="text-xs text-[#202020]/60 italic">No upcoming meetings scheduled.</p>
                ) : (
                  meetings
                    .filter((m) => m.teamId === activeTeamId)
                    .map((meet) => (
                      <div key={meet.id} className="p-3 bg-[#FDF3E7]/40 rounded-lg border border-[#F28C28]/20 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#202020]">
                          <span>{meet.meetingTitle}</span>
                          <span className="text-[10px] text-[#202020]/60">{new Date(meet.scheduledAt).toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-[#202020]/75">{meet.agenda}</p>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Project Objectives & Task Allocation */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider">
                Project Blueprint & Statutory Focus
              </h2>
              <div className="p-4 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-xl text-xs space-y-2">
                <span className="font-bold text-[#202020] block">Central Legal Question:</span>
                <p className="italic text-sm text-[#202020]">"{activeProject.researchQuestion}"</p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#202020] block uppercase text-[11px]">Agreed Research Objectives</span>
                <ul className="space-y-1.5">
                  {activeProject.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#202020]/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Task Allocation Board */}
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold uppercase text-[#202020]/70 tracking-wider">
                    Task Assignments & Research Division
                  </h2>
                  <p className="text-xs text-[#202020]/60">Track deliverables assigned to co-authors</p>
                </div>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="px-3 py-1.5 bg-[#202020] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                >
                  + Add Task
                </button>
              </div>

              <div className="space-y-2.5">
                {teamTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 bg-[#F4F0E6]/30 border border-[#202020]/15 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202020]">{t.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#202020]/75">{t.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-[#202020]/60">
                        <span>Assigned to: <strong>{t.assignedToName}</strong></span>
                        <span>Due: {t.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {t.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => updateTaskStatus(t.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-emerald-700 text-white font-bold rounded text-[10px]"
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTaskStatus(t.id, 'IN_PROGRESS')}
                          className="px-2.5 py-1 bg-gray-200 text-gray-800 font-bold rounded text-[10px]"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONES & MEETINGS */}
      {activeTab === 'milestones' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202020]/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#202020]">Semester Milestones & Peer Review Deadlines</h2>
              <p className="text-xs text-[#202020]/75">
                Structured sequential deliverables required for certificate eligibility and editorial submission.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {teamMilestones.map((ms) => (
              <div
                key={ms.id}
                className="p-5 border border-[#202020]/15 rounded-xl space-y-3 bg-[#F4F0E6]/30 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#202020] text-white flex items-center justify-center font-bold text-xs">
                      {ms.orderIndex}
                    </span>
                    <h3 className="font-bold text-sm text-[#202020]">{ms.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#202020]/60">Target: <strong>{ms.dueDate}</strong></span>
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        ms.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ms.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ms.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#202020]/80">{ms.description}</p>

                {ms.mentorFeedback && (
                  <div className="p-3 bg-white border border-[#202020]/10 rounded-lg text-xs space-y-1">
                    <span className="font-bold text-[#F28C28] text-[10px] uppercase tracking-wider block">
                      Mentor Feedback & Sign-Off
                    </span>
                    <p className="text-[#202020]/80">{ms.mentorFeedback}</p>
                  </div>
                )}

                {(access.isLeadMentor || access.isAdminReviewer) && ms.status !== 'APPROVED' && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() =>
                        updateMilestoneStatus(
                          ms.id,
                          'APPROVED',
                          `Approved by ${currentUserName} on ${new Date().toLocaleDateString()}`
                        )
                      }
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs"
                    >
                      Approve Milestone
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RESEARCH SOURCES & CITATIONS */}
      {activeTab === 'sources' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202020]/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#202020]">Verified Research Source Registry</h2>
              <p className="text-xs text-[#202020]/75">
                Module 9 Source Provenance: All case citations, statutes, and empirical records must be primary or authenticated secondary sources.
              </p>
            </div>
            <button
              onClick={() => setShowAddSource(true)}
              className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified Source</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamSources.map((src) => (
              <div
                key={src.id}
                className="p-5 border border-[#202020]/15 rounded-xl bg-[#F4F0E6]/25 space-y-3 text-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        src.isPrimarySource ? 'bg-[#202020] text-white' : 'bg-white border border-[#202020]/20 text-[#202020]'
                      }`}
                    >
                      {src.isPrimarySource ? 'PRIMARY AUTHORITY' : 'SECONDARY COMMENTARY'}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                      {src.verificationStatus}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#202020]">{src.title}</h3>
                  <p className="text-xs text-[#202020]/75">
                    <strong>Issuing Body:</strong> {src.authorOrInstitution} ({src.publicationDate})
                  </p>

                  <div className="p-2.5 bg-white border border-[#202020]/10 rounded-lg space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#202020]/60 block">Citation Format</span>
                    <code className="text-[#202020] font-mono text-[11px] block">{src.citationMetadata}</code>
                    {src.relevantPageOrParagraph && (
                      <span className="text-[10px] text-[#202020]/70 block">Pin-cite: {src.relevantPageOrParagraph}</span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#202020]/80 italic">"{src.researcherNotes}"</p>
                </div>

                <div className="pt-2 border-t border-[#202020]/10 flex items-center justify-between text-[11px]">
                  {src.officialOrPublisherUrl ? (
                    <a
                      href={src.officialOrPublisherUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F28C28] font-bold flex items-center gap-1 hover:underline"
                    >
                      <span>Official Source Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#202020]/50">Reported Bare Act / Volume</span>
                  )}

                  <span className="text-[#202020]/50">Verified: {src.accessDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MANUSCRIPT DRAFTING & VERSIONING */}
      {activeTab === 'manuscript' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                  Live Manuscript Draft · Version {activeManuscript?.currentVersionNumber}
                </span>
                <h2 className="text-xl font-bold text-[#202020] mt-0.5">{activeManuscript?.title}</h2>
                <p className="text-xs text-[#202020]/60 mt-1">
                  Last saved: {new Date(activeManuscript?.lastEditedAt || '').toLocaleString()} by {activeManuscript?.lastEditedBy}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className="px-3 py-1.5 border border-[#202020]/20 rounded-lg text-xs font-bold text-[#202020] hover:bg-black/5 flex items-center gap-1.5"
                >
                  <History className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Version History ({manuscriptVersions.filter((v) => v.manuscriptId === activeManuscript?.id).length})</span>
                </button>
                <button
                  onClick={() => setShowAddComment(!showAddComment)}
                  className="px-3 py-1.5 border border-[#202020]/20 rounded-lg text-xs font-bold text-[#202020] hover:bg-black/5 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Add Remark</span>
                </button>
                <button
                  onClick={exportManuscript}
                  className="px-3 py-1.5 bg-[#202020] hover:bg-black text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Markdown</span>
                </button>
              </div>
            </div>

            {saveStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  saveStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
                }`}
              >
                {saveStatus.message}
              </div>
            )}

            {/* Version History Drawer */}
            {showVersionHistory && (
              <div className="p-4 bg-[#F4F0E6] border border-[#202020]/15 rounded-xl space-y-3">
                <h3 className="text-xs font-bold uppercase text-[#202020]">Immutable Version Snapshots</h3>
                <div className="space-y-2">
                  {manuscriptVersions
                    .filter((v) => v.manuscriptId === activeManuscript?.id)
                    .map((ver) => (
                      <div
                        key={ver.id}
                        className="p-3 bg-white border border-[#202020]/10 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#202020]">Version {ver.versionNumber}:</span> {ver.changeSummary}
                          <p className="text-[10px] text-[#202020]/60 mt-0.5">
                            Saved by {ver.savedByName} on {new Date(ver.savedAt).toLocaleString()} ({ver.wordCount} words)
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditorContent(ver.content);
                            alert(`Loaded content from Version ${ver.versionNumber}.`);
                          }}
                          className="px-2.5 py-1 bg-[#202020] text-white rounded text-[10px] font-bold"
                        >
                          Load into Editor
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Add Comment Form */}
            {showAddComment && (
              <form onSubmit={handleAddCommentSubmit} className="p-4 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202020]">Leave Inline Remark / Peer Edit</span>
                  <button type="button" onClick={() => setShowAddComment(false)}>
                    <X className="w-4 h-4 text-[#202020]" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={commentSection}
                    onChange={(e) => setCommentSection(e.target.value)}
                    placeholder="Section or Paragraph"
                    className="p-2 border border-[#202020]/20 rounded-md bg-white font-medium"
                  />
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Feedback / suggested citation..."
                    className="sm:col-span-2 p-2 border border-[#202020]/20 rounded-md bg-white font-medium"
                  />
                </div>
                <button type="submit" className="px-3 py-1.5 bg-[#202020] text-white rounded font-bold">
                  Post Remark
                </button>
              </form>
            )}

            {/* Editor Textarea */}
            <form onSubmit={handleSaveDraft} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#202020]/70 mb-1">
                  Manuscript Workspace (Markdown Supported)
                </label>
                <textarea
                  rows={18}
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full p-4 border border-[#202020]/25 rounded-xl text-xs font-mono leading-relaxed bg-[#F4F0E6]/10 outline-hidden focus:border-[#F28C28]"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="w-full sm:w-96">
                  <input
                    type="text"
                    required
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="Summary of changes (mandatory for version audit log)..."
                    className="w-full p-2 border border-[#202020]/20 rounded-lg text-xs outline-hidden focus:border-[#F28C28]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
                >
                  Save as Version {activeManuscript?.currentVersionNumber ? activeManuscript.currentVersionNumber + 1 : 2}
                </button>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="pt-6 border-t border-[#202020]/10 space-y-3">
              <h3 className="text-xs font-bold uppercase text-[#202020]/70">
                Editorial & Peer Remarks ({manuscriptComments.filter((c) => c.manuscriptId === activeManuscript?.id).length})
              </h3>
              <div className="space-y-2">
                {manuscriptComments
                  .filter((c) => c.manuscriptId === activeManuscript?.id)
                  .map((comm) => (
                    <div
                      key={comm.id}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
                        comm.resolved ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-[#202020]/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#202020]">
                          {comm.authorName} ({comm.authorRole.replace('_', ' ')}) · <span className="text-[#F28C28]">{comm.section}</span>
                        </span>
                        {!comm.resolved && (
                          <button
                            onClick={() => resolveManuscriptComment(comm.id)}
                            className="text-[10px] text-emerald-700 font-bold hover:underline"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                      <p className="text-[#202020]/80">{comm.commentText}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ETHICS & AUTHORSHIP AGREEMENT */}
      {activeTab === 'ethics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Research Ethics Checklist */}
          <div className="lg:col-span-6 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider">
                  Module 10 Mandatory Checklist
                </span>
                <h2 className="text-base font-bold text-[#202020]">Research Ethics Board Clearance</h2>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  activeEthics?.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeEthics?.status || 'PENDING CLEARANCE'}
              </span>
            </div>

            <p className="text-xs text-[#202020]/75">
              Before any manuscript is submitted for publication, the team must obtain verified Research Ethics Review clearance.
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { title: 'Plagiarism Checked (< 5% similarity)', ok: activeEthics?.plagiarismChecked },
                { title: 'Primary Source Attribution Confirmed', ok: activeEthics?.properAttributionConfirmed },
                { title: 'Citation Accuracy & Pin-cites Validated', ok: activeEthics?.citationAccuracyChecked },
                { title: 'Personal Data Protection Compliant', ok: activeEthics?.personalDataHandledSafely },
                { title: 'Conflicts of Interest Disclosed', ok: activeEthics?.conflictsOfInterestDisclosed },
                { title: 'AI Assistance Disclosed (Formatting Only)', ok: activeEthics?.aiAssistanceDisclosed },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#F4F0E6]/30 rounded-lg flex items-center justify-between border border-[#202020]/10">
                  <span className="font-medium text-[#202020]">{item.title}</span>
                  {item.ok ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold text-[11px]">Pending Review</span>
                  )}
                </div>
              ))}
            </div>

            {activeEthics?.reviewComments && (
              <div className="p-3 bg-white border border-[#202020]/10 rounded-lg text-xs space-y-1">
                <span className="font-bold text-[#202020] block">Ethics Reviewer Remark:</span>
                <p className="text-[#202020]/80">{activeEthics.reviewComments}</p>
                <p className="text-[10px] text-[#202020]/60 mt-1">Reviewed by: {activeEthics.reviewerName}</p>
              </div>
            )}
          </div>

          {/* Right: Authorship Covenant */}
          <div className="lg:col-span-6 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider">
                  Pre-Agreed Covenant
                </span>
                <h2 className="text-base font-bold text-[#202020]">Authorship Agreement</h2>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  activeAgreement?.isSignedByAll ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeAgreement?.isSignedByAll ? 'FULLY EXECUTED' : 'AWAITING SIGNATURES'}
              </span>
            </div>

            <p className="text-xs text-[#202020]/75 leading-relaxed">
              {activeAgreement?.agreedRolesSummary ||
                'Authorship is determined strictly by substantive contribution (conceptualization, primary doctrinal research, draft writing, and critical revision). No automatic authorship.'}
            </p>

            <div className="space-y-3 text-xs pt-1">
              <span className="font-bold text-[#202020] uppercase text-[11px] block">Signature Ledger</span>
              <div className="p-3 bg-[#F4F0E6]/40 rounded-xl border border-[#202020]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202020]">Mentor: {activeTeam.mentorName}</span>
                  {activeAgreement?.mentorSigned ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Signed
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold">Unsigned</span>
                  )}
                </div>

                {teamMembers
                  .filter((m) => m.userRoleInTeam === 'STUDENT_COAUTHOR')
                  .map((stud) => (
                    <div key={stud.id} className="flex items-center justify-between border-t border-[#202020]/10 pt-2">
                      <span className="font-medium text-[#202020]">Student Co-Author: {stud.userName}</span>
                      {activeAgreement?.studentsSigned?.[stud.userId] ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Signed
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold">Unsigned</span>
                      )}
                    </div>
                  ))}
              </div>

              {/* Action to Sign */}
              <div className="pt-2">
                {access.isLeadMentor && !activeAgreement?.mentorSigned && (
                  <button
                    onClick={() => signAuthorshipAgreement(activeTeamId, 'MENTOR')}
                    className="w-full py-2 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg"
                  >
                    Sign Agreement as Lead Mentor
                  </button>
                )}

                {access.isStudentMember && !activeAgreement?.studentsSigned?.[currentUserId] && (
                  <button
                    onClick={() => signAuthorshipAgreement(activeTeamId, 'STUDENT')}
                    className="w-full py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg"
                  >
                    Sign Agreement as Student Co-Author
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 border border-[#202020]/20 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <h2 className="text-base font-bold text-[#202020]">Add Verified Research Source</h2>
              <button onClick={() => setShowAddSource(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSourceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Source Title *</label>
                <input
                  type="text"
                  required
                  value={newSrcTitle}
                  onChange={(e) => setNewSrcTitle(e.target.value)}
                  placeholder="e.g. Modern Dental College v. State of M.P."
                  className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Author / Issuing Body *</label>
                  <input
                    type="text"
                    required
                    value={newSrcAuthor}
                    onChange={(e) => setNewSrcAuthor(e.target.value)}
                    placeholder="e.g. Supreme Court of India"
                    className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Source Type *</label>
                  <select
                    value={newSrcType}
                    onChange={(e) => setNewSrcType(e.target.value as any)}
                    className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden bg-white"
                  >
                    <option value="case_law">Case Law (Judgment)</option>
                    <option value="legislation">Statute / Legislation</option>
                    <option value="govt_report">Government / Committee Report</option>
                    <option value="academic_publication">Academic Publication</option>
                    <option value="book">Treatise / Book</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Standard Citation *</label>
                <input
                  type="text"
                  required
                  value={newSrcMeta}
                  onChange={(e) => setNewSrcMeta(e.target.value)}
                  placeholder="e.g. (2016) 7 SCC 353; AIR 2016 SC 2601"
                  className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Pin-Point Paragraph or Section</label>
                <input
                  type="text"
                  value={newSrcPin}
                  onChange={(e) => setNewSrcPin(e.target.value)}
                  placeholder="e.g. Paras 62–68 (Four-prong proportionality test)"
                  className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Analytical Notes</label>
                <textarea
                  rows={2}
                  value={newSrcNotes}
                  onChange={(e) => setNewSrcNotes(e.target.value)}
                  placeholder="Brief note on how this authority supports the manuscript argument..."
                  className="w-full p-2 border border-[#202020]/20 rounded-lg outline-hidden"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newSrcIsPrimary}
                  onChange={(e) => setNewSrcIsPrimary(e.target.checked)}
                />
                <span>This is a primary official legal authority (Statute, Case Law, Gazette).</span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-4 py-2 border rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white rounded-lg font-bold"
                >
                  Save to Source Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#202020]/20 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm font-bold">Assign New Research Task</h2>
              <button onClick={() => setShowAddTask(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTaskSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Assigned Co-Author</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.userName}>
                        {m.userName} ({m.userRoleInTeam.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-3 py-1.5 border rounded font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#202020] text-white rounded font-bold">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Schedule Meeting Modal */}
      {showScheduleMeeting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#202020]/20 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-sm font-bold">Schedule Team Sync</h2>
              <button onClick={() => setShowScheduleMeeting(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleScheduleMeetingSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Agenda</label>
                <textarea
                  rows={2}
                  value={meetingAgenda}
                  onChange={(e) => setMeetingAgenda(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleMeeting(false)}
                  className="px-3 py-1.5 border rounded font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#F28C28] text-white rounded font-bold">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
