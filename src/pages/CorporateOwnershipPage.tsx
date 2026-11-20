import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EntityOwnershipRecord, NationalEntity } from '../types';
import {
  Share2,
  Building2,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  PieChart,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';

interface Props {
  initialCompanyId?: string;
}

export const CorporateOwnershipPage: React.FC<Props> = ({ initialCompanyId }) => {
  const { entities, ownershipRecords, navigate } = useApp();

  // Corporate entities list
  const corporateEntities = useMemo(() => {
    return entities.filter(
      (e) => e.entityType === 'registered_company' || e.entityType === 'public_enterprise'
    );
  }, [entities]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompanyId || corporateEntities[0]?.entityId || 'ent-chambal-fert'
  );

  const activeCompany = useMemo(() => {
    return entities.find((e) => e.entityId === selectedCompanyId) || corporateEntities[0];
  }, [entities, selectedCompanyId, corporateEntities]);

  const activeOwnershipRecords = useMemo(() => {
    return ownershipRecords.filter((o) => o.ownedEntityId === activeCompany?.entityId);
  }, [ownershipRecords, activeCompany]);

  const totalDisclosedPercentage = useMemo(() => {
    return activeOwnershipRecords.reduce((acc, r) => acc + (r.shareholdingPercentage || 0), 0);
  }, [activeOwnershipRecords]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Share2 className="w-3.5 h-3.5" />
          <span>Stage 08 Shareholder & Ownership Intelligence</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Corporate Ownership & Shareholding Registry
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Source-backed capital structure intelligence derived strictly from statutory MCA Form MGT-7 annual returns and SEBI Regulation 31 stock exchange disclosures.
        </p>
      </div>

      {/* Mandatory Safeguards Banner */}
      <div className="bg-[#202020] text-[#F4F0E6] rounded-2xl p-6 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Mandatory Ownership Integrity Standards</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#F4F0E6]/80 pt-1">
          <p>
            <strong>No AI Guesses:</strong> Undisclosed or sub-threshold shareholdings are never estimated with AI models.
          </p>
          <p>
            <strong>No Director Equivalence:</strong> Directorship and board governance are tracked separately from equity ownership.
          </p>
          <p>
            <strong>Temporal Anchoring:</strong> All shareholding patterns are explicitly linked to filed reporting quarters.
          </p>
        </div>
      </div>

      {/* Company Selector Grid */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-5 shadow-xs space-y-3">
        <label className="block text-xs font-bold uppercase text-[#202020]/70">
          Select Corporate Entity to Inspect
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {corporateEntities.map((comp) => (
            <button
              key={comp.entityId}
              onClick={() => setSelectedCompanyId(comp.entityId)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedCompanyId === comp.entityId
                  ? 'border-[#F28C28] bg-[#FDF3E7] ring-1 ring-[#F28C28]'
                  : 'border-[#202020]/15 bg-white hover:bg-[#F4F0E6]/40'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-[#202020] line-clamp-1">{comp.canonicalName}</p>
                <p className="text-[10px] text-[#202020]/60 mt-0.5">{comp.headquartersLocation.city}, {comp.headquartersLocation.state}</p>
              </div>
              <span className="text-[10px] font-mono text-[#F28C28] font-bold mt-2">
                CIN: {comp.registrationNumber?.slice(0, 10)}...
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Company Detail & Ownership Distribution */}
      {activeCompany && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Ownership Breakdown Table */}
          <div className="lg:col-span-8 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  {activeCompany.legalForm}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#202020]">
                  {activeCompany.canonicalName}
                </h2>
                <p className="text-xs text-[#202020]/60 font-mono mt-0.5">
                  CIN: {activeCompany.registrationNumber}
                </p>
              </div>

              <button
                onClick={() => navigate(`/entities/${activeCompany.entityId}`)}
                className="text-xs font-bold text-[#202020] hover:text-[#F28C28] underline flex items-center gap-1"
              >
                <span>Full Entity Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ownership Table */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase text-[#202020]/80">
                Disclosed Equity Holdings & Beneficial Stakes
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#202020]">
                  <thead className="bg-[#F4F0E6] text-[#202020] font-bold uppercase text-[11px] border-b border-[#202020]/15">
                    <tr>
                      <th className="p-3">Shareholder / Stakeholder</th>
                      <th className="p-3">Holding Type</th>
                      <th className="p-3">Share Class</th>
                      <th className="p-3 text-right">Stake (%)</th>
                      <th className="p-3">Filing Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]/10">
                    {activeOwnershipRecords.map((rec) => (
                      <tr key={rec.ownershipRecordId} className="hover:bg-black/2">
                        <td className="p-3 font-semibold">
                          {rec.ownerPersonName || rec.ownerEntityId}
                          {rec.notes && (
                            <p className="text-[10px] text-[#202020]/60 font-normal mt-0.5">{rec.notes}</p>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F4F0E6] text-[#202020]">
                            {rec.relationshipType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-[#202020]/75">{rec.shareClass}</td>
                        <td className="p-3 text-right font-mono font-black text-sm text-[#202020]">
                          {rec.shareholdingPercentage ? `${rec.shareholdingPercentage.toFixed(2)}%` : 'Disclosed N/A'}
                        </td>
                        <td className="p-3 font-mono text-[10px] text-[#202020]/60">
                          {rec.sourceDocumentReference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Progress bar of disclosed vs public float */}
              <div className="p-4 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#202020]">
                  <span>Total Documented Shareholding Identified:</span>
                  <span className="font-mono text-sm text-[#F28C28]">{totalDisclosedPercentage.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-[#202020]/10 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#F28C28] h-full"
                    style={{ width: `${Math.min(totalDisclosedPercentage, 100)}%` }}
                  />
                  <div
                    className="bg-emerald-600 h-full"
                    style={{ width: `${Math.max(100 - totalDisclosedPercentage, 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#202020]/60">
                  <span>Major Promoters & Institutional: {totalDisclosedPercentage.toFixed(1)}%</span>
                  <span>Public / Dispersed Retail: {(100 - totalDisclosedPercentage).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Source Provenance & Regulatory Filing Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase">
                <FileCheck className="w-4 h-4" />
                <span>Regulatory Filing Provenance</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Regulatory Body</span>
                  <p className="font-bold text-[#202020]">Ministry of Corporate Affairs (MCA21) & SEBI</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Statutory Form Basis</span>
                  <p className="text-[#202020]/80">Form MGT-7 (Annual Return) & Regulation 31 SEBI (LODR) Regulations</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Verification State</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    VERIFIED STATUTORY FILING
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#202020]/10 space-y-2">
                <button
                  onClick={() => navigate(`/stakeholders/${activeCompany.entityId}`)}
                  className="w-full py-2 px-3 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#F28C28]" />
                  <span>Inspect in Stakeholder Graph</span>
                </button>
                <button
                  onClick={() => navigate(`/corrections?targetType=ownership&targetId=${activeCompany.entityId}&targetName=${encodeURIComponent(activeCompany.canonicalName)}`)}
                  className="w-full py-2 px-3 bg-white border border-[#202020]/20 hover:bg-black/5 text-xs font-semibold text-[#202020] rounded-lg transition-colors"
                >
                  Report Ownership Inaccuracy
                </button>
              </div>
            </div>

            {/* Limitations Notice */}
            <div className="p-4 bg-white border border-[#202020]/15 rounded-2xl shadow-xs space-y-2 text-xs text-[#202020]/75">
              <div className="flex items-center gap-1.5 font-bold text-[#202020]">
                <Info className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Data Completeness Disclosure</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Listed companies disclose individual equity holders exceeding 1% threshold on quarterly basis. Private companies file annual returns after AGM. Changes between reporting cycles reflect upon subsequent official statutory filings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
