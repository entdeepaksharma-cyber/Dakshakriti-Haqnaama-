/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Module 12: Public Publication Repository & Corrections — HAQNAAMA Legal Research Fellowship
 */

import React, { useState, useMemo } from 'react';
import { useFellowship } from '../../context/FellowshipContext';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Download,
  BookOpen,
  Award,
  ChevronRight,
  X,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PublicationRecord } from '../../types/fellowship';

export const PublicationRepositoryPage: React.FC = () => {
  const { publications, correctionRequests, submitCorrectionRequest } = useFellowship();
  const { navigate } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Full-text reader modal
  const [readerPub, setReaderPub] = useState<PublicationRecord | null>(null);

  // Correction request modal
  const [correctionPub, setCorrectionPub] = useState<PublicationRecord | null>(null);
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [evidenceProvided, setEvidenceProvided] = useState('');
  const [corrResult, setCorrResult] = useState<string | null>(null);

  const filteredPublications = useMemo(() => {
    return publications.filter((p) => {
      // Respect copyright and author agreement: only show published or approved items
      const isPublic = p.externalStatus === 'PUBLISHED' || p.fullTextApprovedForPublic;
      if (!isPublic) return false;

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.authors.some((a) => a.toLowerCase().includes(q)) ||
        (p.doiOrPersistentId && p.doiOrPersistentId.toLowerCase().includes(q));

      const matchType = selectedType === 'all' || p.outputType === selectedType;
      const matchYear = selectedYear === 'all' || (p.publicationDate && p.publicationDate.startsWith(selectedYear));

      return matchSearch && matchType && matchYear;
    });
  }, [publications, searchQuery, selectedType, selectedYear]);

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionPub || !errorDesc.trim()) return;

    const id = submitCorrectionRequest({
      targetPublicationId: correctionPub.id,
      targetTitle: correctionPub.title,
      requesterName: reporterName.trim() || 'Civic Scholar',
      requesterEmail: reporterEmail.trim(),
      descriptionOfError: errorDesc.trim(),
      evidenceProvided: evidenceProvided.trim() || 'Published statutory or judicial contradiction',
    });

    setCorrResult(id);
    setErrorDesc('');
    setEvidenceProvided('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/40 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Stage 12 Public Legal Scholarship Repository</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Published Legal Research & Working Papers
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Open-access repository of peer-reviewed articles, statutory research monographs, and case comments co-authored under the HAQNAAMA Legal Research Fellowship.
        </p>
      </div>

      {/* Repository Safeguard Disclosures */}
      <div className="bg-[#202020] text-[#F4F0E6] rounded-2xl p-5 shadow-xs space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#F28C28] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Repository Integrity & Verification Standards</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[#F4F0E6]/80 pt-1">
          <p>
            <strong>No Pre-Emptive Indexing:</strong> Manuscripts are only designated "PUBLISHED" once external journal acceptance or formal monograph publication is verified.
          </p>
          <p>
            <strong>Draft Privacy:</strong> Internal team notes, working drafts, and confidential peer review comments are strictly protected from public exposure.
          </p>
          <p>
            <strong>Errata & Corrections:</strong> Any citation discrepancies or statutory amendments post-publication are documented transparently through our public dispute channel.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#202020]/50 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, DOI, or keyword..."
            className="w-full pl-9 pr-3 py-2 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#202020]/70">Format:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-1.5 border border-[#202020]/20 rounded-md bg-white font-medium outline-hidden"
            >
              <option value="all">All Formats</option>
              <option value="journal_article">Journal Article</option>
              <option value="legal_research_report">Research Monograph</option>
              <option value="working_paper">Working Paper</option>
              <option value="case_comment">Case Comment</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[#202020]/70">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-1.5 border border-[#202020]/20 rounded-md bg-white font-medium outline-hidden"
            >
              <option value="all">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        {filteredPublications.map((pub) => (
          <div
            key={pub.id}
            className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 hover:border-[#F28C28] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#202020] text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  {pub.outputType.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#202020]/60">Published: <strong>{pub.publicationDate}</strong></span>
              </div>

              {pub.doiOrPersistentId && (
                <div className="text-[11px] font-mono text-[#F28C28] font-bold">
                  Identifier: {pub.doiOrPersistentId}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#202020] leading-snug">
                {pub.title}
              </h2>

              <p className="text-xs font-semibold text-[#202020]/80">
                Co-Authors: <span className="text-[#F28C28]">{pub.authors.join(' · ')}</span>
              </p>

              <p className="text-xs text-[#202020]/70 leading-relaxed line-clamp-3">
                {pub.abstract}
              </p>

              <div className="p-3 bg-[#F4F0E6]/50 rounded-xl border border-[#202020]/10 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#202020]/60 block">Journal / Publisher</span>
                <p className="font-medium text-[#202020]">{pub.targetJournalOrPublisher} · {pub.volumeIssuePages}</p>
              </div>

              {pub.correctionNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 text-amber-900">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Corrigendum / Correction Note Published:</span>
                  </span>
                  <p>{pub.correctionNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#202020]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                {pub.fullTextContent && (
                  <button
                    onClick={() => setReaderPub(pub)}
                    className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Open-Access Full Text</span>
                  </button>
                )}

                {pub.fullTextAccessUrl && (
                  <a
                    href={pub.fullTextAccessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-[#202020]/20 hover:bg-black/5 rounded-lg text-[#202020] font-bold flex items-center gap-1.5"
                  >
                    <span>Publisher PDF</span>
                    <ExternalLink className="w-3 h-3 text-[#F28C28]" />
                  </a>
                )}
              </div>

              <button
                onClick={() => {
                  setCorrectionPub(pub);
                  setCorrResult(null);
                }}
                className="text-xs text-[#202020]/70 hover:text-[#202020] underline"
              >
                Report Correction / Erratum
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <div className="p-12 text-center bg-white border border-[#202020]/15 rounded-2xl text-xs text-[#202020]/60">
          No published research matches the specified search filter.
        </div>
      )}

      {/* FULL TEXT MODAL */}
      {readerPub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto border border-[#202020]/20 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider">
                  Open-Access Full Text · {readerPub.targetJournalOrPublisher}
                </span>
                <h2 className="text-xl font-black text-[#202020] mt-1">{readerPub.title}</h2>
                <p className="text-xs text-[#202020]/70 mt-1">Authors: {readerPub.authors.join(', ')}</p>
              </div>
              <button onClick={() => setReaderPub(null)} className="p-1.5 rounded-lg hover:bg-black/5">
                <X className="w-5 h-5 text-[#202020]" />
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-[#202020]/90 font-mono leading-relaxed bg-[#F4F0E6]/20 p-6 rounded-xl border border-[#202020]/10 whitespace-pre-wrap">
              {readerPub.fullTextContent}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setReaderPub(null)}
                className="px-5 py-2 bg-[#202020] text-white rounded-lg text-xs font-bold"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORRECTION / DISPUTE MODAL */}
      {correctionPub && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-[#202020]/20 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#F28C28] uppercase">Academic Dispute & Erratum</span>
                <h2 className="text-sm font-bold text-[#202020]">Report Inaccuracy in Published Research</h2>
              </div>
              <button onClick={() => setCorrectionPub(null)}>
                <X className="w-4 h-4 text-[#202020]" />
              </button>
            </div>

            {corrResult ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Correction Request Logged!</span>
                </div>
                <p>
                  Dispute tracking ID: <strong>{corrResult}</strong>. The Editorial Board will review your citation challenge against primary legal sources.
                </p>
                <button
                  onClick={() => setCorrectionPub(null)}
                  className="px-4 py-1.5 bg-[#202020] text-white rounded font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-3">
                <p className="text-[11px] text-[#202020]/75">
                  Target Paper: <strong>{correctionPub.title}</strong>
                </p>

                <div>
                  <label className="block font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Adv. Rajesh Verma"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="e.g. r.verma@bar.in"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Description of Error / Contradiction *</label>
                  <textarea
                    rows={3}
                    required
                    value={errorDesc}
                    onChange={(e) => setErrorDesc(e.target.value)}
                    placeholder="Specify the footnote, cited paragraph, or statutory error requiring corrigendum..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Evidence Reference (Gazette, SCC, Law Commission Report)</label>
                  <input
                    type="text"
                    value={evidenceProvided}
                    onChange={(e) => setEvidenceProvided(e.target.value)}
                    placeholder="e.g. Gazette Notification No. F.12(4) or (2024) 2 SCC 145"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectionPub(null)}
                    className="px-3 py-1.5 border rounded font-bold"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-[#202020] text-white rounded font-bold">
                    Submit Erratum Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
