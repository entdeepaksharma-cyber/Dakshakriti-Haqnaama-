import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CorrectionReport } from '../types';
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';

export const CorrectionCentrePage: React.FC = () => {
  const { corrections, submitCorrection, updateCorrectionStatus, activeRole, routeQuery } = useApp();

  // Query params prefill
  const prefillTarget = routeQuery.get('targetName') || '';
  const prefillId = routeQuery.get('targetId') || '';
  const prefillType = (routeQuery.get('targetType') as CorrectionReport['targetType']) || 'entity';

  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [targetType, setTargetType] = useState<CorrectionReport['targetType']>(prefillType);
  const [targetName, setTargetName] = useState(prefillTarget);
  const [issueType, setIssueType] = useState<CorrectionReport['issueType']>('incorrect_relationship');
  const [description, setDescription] = useState('');
  const [evidenceRef, setEvidenceRef] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const filteredCorrections = corrections.filter(
    (c) => filterStatus === 'all' || c.status === filterStatus
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !description.trim()) return;

    submitCorrection({
      targetType,
      targetId: prefillId || `custom-${Date.now()}`,
      targetName: targetName.trim(),
      reporterName: reporterName.trim() || 'Anonymous Civic Researcher',
      reporterEmail: reporterEmail.trim() || 'unspecified@civic.internal',
      issueType,
      description: description.trim(),
      evidenceReference: evidenceRef.trim() || 'Independent observation',
    });

    setSubmitSuccess(true);
    setDescription('');
    setEvidenceRef('');
  };

  const handleStatusChange = (id: string, newStatus: CorrectionReport['status']) => {
    const notes = adminNotes[id] || 'Status updated via administrative console';
    updateCorrectionStatus(id, newStatus, notes);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Stage 14 Correction & Dispute Centre</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Data Integrity & Dispute Resolution
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Open citizen and researcher correction channel. Report unsupported claims, outdated corporate filings, or incorrect administrative boundaries. All reports enter our transparent review workflow: <code>SUBMITTED → TRIAGED → UNDER REVIEW → RESOLVED</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Submit a Dispute */}
        <div className="lg:col-span-5 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#202020] uppercase tracking-wider">
            1. Report an Inaccuracy
          </h2>

          {submitSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-[#202020]">Dispute Logged Successfully</h3>
              <p className="text-xs text-[#202020]/70">
                Your report has been assigned an audit tracking number and queued for review.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 bg-[#202020] text-white text-xs font-bold rounded-lg"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Target Record Type
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as CorrectionReport['targetType'])}
                  className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg font-medium text-[#202020]"
                >
                  <option value="entity">National Entity / Institution</option>
                  <option value="geography">Administrative Unit / Geography</option>
                  <option value="ownership">Corporate Shareholder Record</option>
                  <option value="relationship">Stakeholder Relationship</option>
                  <option value="source">Data Source Record</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Name / Identifier of the Record
                </label>
                <input
                  type="text"
                  required
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g. DLSA Kota address or CFCL promoter holding"
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-[#202020] focus:border-[#F28C28] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Dispute Category
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as CorrectionReport['issueType'])}
                  className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg font-medium text-[#202020]"
                >
                  <option value="incorrect_relationship">Unsupported Stakeholder Relationship</option>
                  <option value="incorrect_ownership">Outdated or Incorrect Shareholding</option>
                  <option value="outdated_location">Relocated / Outdated Address</option>
                  <option value="incorrect_name">Incorrect Official / Canonical Name</option>
                  <option value="outdated_source">Outdated Source Gazette</option>
                  <option value="verification_dispute">Dispute Regarding Verification Status</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Factual Inconsistency Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the discrepancy with exact details and official references..."
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-[#202020] focus:border-[#F28C28] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Evidence URL / Gazette Notification Ref
                </label>
                <input
                  type="text"
                  value={evidenceRef}
                  onChange={(e) => setEvidenceRef(e.target.value)}
                  placeholder="e.g. Rajasthan Gazette No. 248 or BSE Filing link"
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-[#202020] focus:border-[#F28C28] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Researcher name"
                    className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                    Email (For Audit)
                  </label>
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="name@institution.in"
                    className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold rounded-lg shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Audit Queue</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Active Disputes & Audit Trail */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  Public Correction Queue
                </span>
                <h3 className="text-base font-bold text-[#202020]">
                  Logged Inaccuracies & Resolution Status ({filteredCorrections.length})
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#202020]/60 font-semibold">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-1 bg-[#F4F0E6]/40 border border-[#202020]/15 rounded text-xs font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredCorrections.map((corr) => (
                <div
                  key={corr.id}
                  className="p-4 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-xl space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                          {corr.targetType}
                        </span>
                        <span className="text-[10px] text-[#202020]/50 font-mono">
                          ID: {corr.id}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#202020] mt-0.5">{corr.targetName}</h4>
                      <p className="text-[11px] text-[#202020]/70 font-medium">Issue: {corr.issueType.replace('_', ' ')}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        corr.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : corr.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : corr.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {corr.status}
                    </span>
                  </div>

                  <p className="p-2.5 bg-white rounded-lg border border-[#202020]/10 leading-relaxed text-[#202020]">
                    {corr.description}
                  </p>

                  {corr.evidenceReference && (
                    <p className="text-[11px] text-[#202020]/75">
                      <span className="font-semibold">Evidence Reference: </span>
                      {corr.evidenceReference}
                    </p>
                  )}

                  {corr.reviewerNotes && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] text-emerald-900">
                      <strong>Reviewer Determination: </strong>
                      {corr.reviewerNotes}
                    </div>
                  )}

                  {/* Reviewer / Admin Actions */}
                  {(activeRole === 'ADMINISTRATOR' || activeRole === 'REVIEWER') && corr.status !== 'RESOLVED' && (
                    <div className="pt-2 border-t border-[#202020]/10 space-y-2">
                      <input
                        type="text"
                        placeholder="Add reviewer notes for resolution..."
                        value={adminNotes[corr.id] || ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [corr.id]: e.target.value })}
                        className="w-full p-1.5 bg-white border border-[#202020]/20 rounded text-[11px]"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleStatusChange(corr.id, 'UNDER_REVIEW')}
                          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] rounded"
                        >
                          Mark Under Review
                        </button>
                        <button
                          onClick={() => handleStatusChange(corr.id, 'RESOLVED')}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept & Resolve</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(corr.id, 'REJECTED')}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[10px] rounded flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
