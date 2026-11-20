/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Module 1: Public Programme Page — HAQNAAMA Legal Research Fellowship (HLRF)
 */

import React, { useState } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
  Mail,
  PlayCircle,
  FolderLock,
  Layers,
} from 'lucide-react';

export const FellowshipPublicPage: React.FC = () => {
  const { config, projects, publications, studentApplications, mentorApplications } = useFellowship();
  const { navigate } = useApp();

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Do undergraduate law students need prior publications to apply?',
      a: 'No. The HAQNAAMA Legal Research Fellowship explicitly welcomes undergraduate law students without prior publications. Candidates are assessed on legal reasoning, research diligence, learning goals, and commitment to academic ethics, rather than past authorship.',
    },
    {
      q: 'How are research teams structured and what is the time commitment?',
      a: 'The default model pairs one approved faculty or practitioner mentor with 2–3 selected student co-authors. The fellowship spans one academic semester (approx. 5–6 months). Students typically commit 10–14 hours per week, structured around milestone deadlines.',
    },
    {
      q: 'Does HAQNAAMA guarantee publication or journal acceptance?',
      a: 'No. HAQNAAMA does not guarantee external journal acceptance. All manuscripts undergo internal peer and ethics review. Teams are supported in preparing rigorous submissions, and selected manuscripts may be published in the open-access HAQNAAMA Legal Research Repository or submitted to external peer-reviewed law reviews.',
    },
    {
      q: 'How does the Authorship Policy work?',
      a: 'Before substantive writing begins, each team signs a formal Authorship Agreement codifying roles, contribution criteria (conceptualization, doctrinal research, draft writing, citation checking), and agreed author order. Automatic authorship without genuine scholarly contribution is strictly prohibited.',
    },
    {
      q: 'Is there any fee or financial obligation to participate?',
      a: 'No. Participation is 100% free and independent. The fellowship operates as a civic-academic public good dedicated to Indian legal scholarship and access to justice research.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-12 border-b border-[#202020]/10 bg-linear-to-b from-white/50 to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-md text-xs font-bold text-[#F28C28] shadow-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>HAQNAAMA Legal Research Fellowship (HLRF) · {config.currentCycleName}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#202020] tracking-tight leading-[1.15] [text-wrap:balance]">
            Mentored Legal Research & Co-Authorship for Law Students
          </h1>

          <p className="text-sm sm:text-base text-[#202020]/80 max-w-2xl mx-auto leading-relaxed">
            Connecting experienced legal researchers and advocates with undergraduate law students to conduct structured, evidence-based research and co-author original manuscripts for peer-reviewed publication.
          </p>

          {/* Key Dates Badge Strip */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-3 bg-white border border-[#202020]/15 rounded-xl text-xs font-semibold text-[#202020] shadow-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#F28C28]" />
              <span>Student Deadline: <strong>{config.studentApplicationDeadline}</strong></span>
            </div>
            <span className="text-[#202020]/30 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F28C28]" />
              <span>Mentor Deadline: <strong>{config.mentorApplicationDeadline}</strong></span>
            </div>
            <span className="text-[#202020]/30 hidden sm:inline">|</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#F28C28]" />
              <span>Duration: <strong>1 Semester ({config.currentCycleSemester})</strong></span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/fellowship/apply-student')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <span>Apply as Student Co-Author</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/fellowship/apply-mentor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <span>Apply as Research Mentor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/fellowship/projects')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Browse Active Projects</span>
            </button>
            <button
              onClick={() => navigate('/fellowship/publications')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>View Published Research</span>
            </button>
          </div>
        </div>
      </section>

      {/* Honest Programme Metrics Strip (Derived strictly from persisted database) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#202020]/15 rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Active Research Projects</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{projects.length}</p>
            <p className="text-[11px] text-[#202020]/75">Constitutional, Revenue & Criminal Law</p>
          </div>
          <div className="p-5 bg-white border border-[#202020]/15 rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Student Applications</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{studentApplications.length}</p>
            <p className="text-[11px] text-[#202020]/75">Undergraduate applicants across India</p>
          </div>
          <div className="p-5 bg-white border border-[#202020]/15 rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Approved Mentors</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">
              {mentorApplications.filter((m) => m.credentialsVerified && m.status === 'APPROVED').length}
            </p>
            <p className="text-[11px] text-[#202020]/75">Independently verified credentials</p>
          </div>
          <div className="p-5 bg-white border border-[#202020]/15 rounded-2xl shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Repository Publications</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{publications.length}</p>
            <p className="text-[11px] text-emerald-700 font-semibold">100% Open Access & Sourced</p>
          </div>
        </div>
      </section>

      {/* How the Fellowship Works: 4 Pillar Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">Programme Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#202020]">How the Fellowship Operates</h2>
          <p className="text-xs sm:text-sm text-[#202020]/75">
            Structured into a transparent, step-by-step academic cycle ensuring rigorous scholarship and ethical co-authorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28] font-black text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-[#202020]">Mentor Proposals</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              Approved legal scholars and advocates formulate targeted research questions addressing Indian constitutional, statutory, and grassroots administrative challenges.
            </p>
          </div>

          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28] font-black text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-[#202020]">Curated Team Matching</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              Undergraduate students apply with statements of interest. Programme coordinators pair each mentor with exactly 2–3 student co-authors based on interest and skills.
            </p>
          </div>

          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28] font-black text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-[#202020]">Collaborative Workspace</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              Teams utilize an integrated research workspace with structured milestones, primary source libraries, Bluebook citation registries, version history, and conflict detection.
            </p>
          </div>

          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28] font-black text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-[#202020]">Ethics & Authorship</h3>
            <p className="text-xs text-[#202020]/75 leading-relaxed">
              Pre-agreed co-authorship covenants and formal Research Ethics Board clearance (verified plagiarism check, AI disclosures) before publication submission.
            </p>
          </div>
        </div>
      </section>

      {/* Research Project Lifecycle Stepper */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">Semester Lifecycle</span>
            <h3 className="text-xl font-bold text-[#202020]">The 6-Phase Manuscript Journey</h3>
            <p className="text-xs text-[#202020]/75">
              Every research project follows an evidence-first progression from statutory mapping to peer review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
            {[
              { num: '1', title: 'Plan & Mapping', desc: 'Statutory scope & literature review' },
              { num: '2', title: 'Source Assembly', desc: 'Bare acts & primary case law synthesis' },
              { num: '3', title: 'First Draft', desc: 'Doctrinal analysis & co-author writing' },
              { num: '4', title: 'Citation Audit', desc: 'Line-by-line verification & pin-cites' },
              { num: '5', title: 'Ethics Review', desc: 'Plagiarism check & attribution sign-off' },
              { num: '6', title: 'Publication Prep', desc: 'Journal submission & repository release' },
            ].map((step) => (
              <div key={step.num} className="p-3 bg-[#F4F0E6]/50 rounded-xl border border-[#202020]/10 space-y-1 text-xs">
                <div className="w-5 h-5 rounded-full bg-[#202020] text-white flex items-center justify-center text-[10px] font-bold">
                  {step.num}
                </div>
                <p className="font-bold text-[#202020]">{step.title}</p>
                <p className="text-[11px] text-[#202020]/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandatory Safeguards & Disclaimers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#202020] text-[#F4F0E6] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Academic Integrity & Public Disclaimers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#F4F0E6]/85 pt-2">
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm">No Artificial Claims</h4>
              <p className="leading-relaxed">
                HAQNAAMA does not claim official affiliations with any government ministry, court, or university bar council. Mentors and students participate in their individual academic capacities.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm">Truth in Publication</h4>
              <p className="leading-relaxed">
                We never fabricate publication metrics, DOI identifiers, or claim journal acceptance before verified editorial letters are logged and audited.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-sm">Anti-Hallucination Mandate</h4>
              <p className="leading-relaxed">
                AI may assist with grammar formatting and literature organization, but AI models are strictly prohibited from generating legal judgments, statutory provisions, or fictitious citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">Common Questions</span>
          <h2 className="text-2xl font-black text-[#202020]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#202020]/15 rounded-xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#202020] hover:bg-[#FDF3E7]/50"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#F28C28] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#202020]/50 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#202020]/80 border-t border-[#202020]/10 leading-relaxed bg-[#F4F0E6]/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Administrative and Acceptance Test Hub CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase text-[#F28C28] tracking-wider">
              Programme Management & System Testing
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#202020]">
              Administrative Review & Automated Test Suite
            </h3>
            <p className="text-xs text-[#202020]/75 max-w-xl">
              Coordinators can manage admissions, verify credentials, charter teams, and execute all 24 acceptance tests.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/fellowship/admin')}
              className="px-4 py-2 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Admin Dashboard
            </button>
            <button
              onClick={() => navigate('/fellowship/tests')}
              className="px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Run Acceptance Tests (24)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
