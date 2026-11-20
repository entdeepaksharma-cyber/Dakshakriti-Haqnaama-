import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Share2,
  ArrowLeft,
  Calendar,
  Layers,
  FileCheck,
  BookmarkPlus,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface Props {
  entityId: string;
}

export const EntityDetailPage: React.FC<Props> = ({ entityId }) => {
  const { entities, ownershipRecords, relationships, sources, navigate, researchProjects, saveEntityToProject } = useApp();

  const [savedProjectMsg, setSavedProjectMsg] = useState('');

  const entity = useMemo(() => {
    return entities.find((e) => e.entityId === entityId) || entities[0];
  }, [entities, entityId]);

  // Ownership records where entity is owned or is the owner
  const relevantOwnership = useMemo(() => {
    return ownershipRecords.filter((o) => o.ownedEntityId === entity.entityId || o.ownerEntityId === entity.entityId);
  }, [ownershipRecords, entity]);

  // Relationships involving this entity
  const relevantRelationships = useMemo(() => {
    return relationships.filter((r) => r.sourceEntityId === entity.entityId || r.targetEntityId === entity.entityId);
  }, [relationships, entity]);

  const handleSaveToProject = () => {
    if (researchProjects.length > 0) {
      saveEntityToProject(researchProjects[0].id, entity.entityId);
      setSavedProjectMsg(`Saved to dossier: "${researchProjects[0].title}"`);
      setTimeout(() => setSavedProjectMsg(''), 3000);
    } else {
      navigate('/research');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/entities')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#202020]/70 hover:text-[#202020] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Entity Registry</span>
        </button>
      </div>

      {/* Main Dossier Header */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#202020]/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                {entity.entityType.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 rounded-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{entity.verificationStatus.toUpperCase()}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#202020]">
              {entity.canonicalName}
            </h1>
            <p className="text-xs text-[#202020]/70">
              Official Registered Name: <strong>{entity.officialName}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveToProject}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F4F0E6] hover:bg-black/10 text-xs font-bold text-[#202020] rounded-lg transition-colors border border-[#202020]/15"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Save to Dossier</span>
            </button>
            <button
              onClick={() => navigate(`/stakeholders/${entity.entityId}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Explore in Graph</span>
            </button>
          </div>
        </div>

        {savedProjectMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800">
            {savedProjectMsg}
          </div>
        )}

        {/* Overview & Key Identifiers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#F4F0E6]/30 p-4 rounded-xl border border-[#202020]/10">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Legal Form</span>
            <p className="font-bold text-[#202020] mt-0.5">{entity.legalForm}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Official Identifier</span>
            <p className="font-mono font-bold text-[#202020] mt-0.5">
              {entity.registrationNumber || 'Statutory Non-Corporate'}
            </p>
            <span className="text-[9px] text-[#202020]/50">{entity.registrationAuthority}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Jurisdiction</span>
            <p className="font-medium text-[#202020] mt-0.5">{entity.jurisdictionId.toUpperCase()}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#202020]/60">Incorporated / Valid From</span>
            <p className="font-medium text-[#202020] mt-0.5">{entity.validFrom}</p>
          </div>
        </div>

        {/* Headquarters & Contact */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase text-[#202020]/80">Headquarters & Operating Location</h2>
          <div className="p-4 bg-white border border-[#202020]/15 rounded-xl flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#F28C28] shrink-0 mt-0.5" />
              <div className="text-xs text-[#202020]">
                <p className="font-bold">{entity.headquartersLocation.city}, {entity.headquartersLocation.state}</p>
                {entity.headquartersLocation.address && (
                  <p className="text-[#202020]/70 mt-0.5">{entity.headquartersLocation.address}</p>
                )}
                {entity.headquartersLocation.lat && (
                  <p className="text-[10px] font-mono text-[#202020]/50 mt-1">
                    Geo-coordinates: {entity.headquartersLocation.lat}°N, {entity.headquartersLocation.lng}°E
                  </p>
                )}
              </div>
            </div>

            {entity.officialWebsite && (
              <a
                href={entity.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F28C28] hover:text-[#D9771E] shrink-0"
              >
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Corporate Ownership & Shareholding Disclosures (If Applicable) */}
      {relevantOwnership.length > 0 && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                Public Capital & Shareholding
              </span>
              <h3 className="text-base font-bold text-[#202020]">
                Source-Backed Ownership Records
              </h3>
            </div>
            <button
              onClick={() => navigate(`/companies/${entity.entityId}/ownership`)}
              className="text-xs font-bold text-[#F28C28] underline"
            >
              Full Ownership Breakdown →
            </button>
          </div>

          <div className="divide-y divide-[#202020]/10 text-xs">
            {relevantOwnership.map((rec) => (
              <div key={rec.ownershipRecordId} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-[#202020]">
                    {rec.ownerPersonName || rec.ownerEntityId}
                  </p>
                  <p className="text-[11px] text-[#202020]/60">
                    Relationship: <span className="font-semibold">{rec.relationshipType.replace('_', ' ').toUpperCase()}</span> · {rec.shareClass}
                  </p>
                  <p className="text-[10px] text-[#202020]/50 mt-0.5">
                    Source: {rec.ownershipBasis} ({rec.reportingPeriod})
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {rec.shareholdingPercentage && (
                    <span className="text-base font-black text-[#202020] font-mono">
                      {rec.shareholdingPercentage}%
                    </span>
                  )}
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase">VERIFIED FILING</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-950">
            <strong>Mandatory Anti-Hallucination Safeguard:</strong> Shareholder records are populated strictly from statutory annual returns (Form MGT-7) or SEBI Regulation 31 stock exchange filings. Undisclosed holdings are not estimated or generated by AI models.
          </div>
        </div>
      )}

      {/* Documented Stakeholder Relationships */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
              Inter-Institutional Graph
            </span>
            <h3 className="text-base font-bold text-[#202020]">
              Documented Stakeholder & Jurisdictional Connections ({relevantRelationships.length})
            </h3>
          </div>
          <button
            onClick={() => navigate(`/stakeholders/${entity.entityId}`)}
            className="text-xs font-bold text-[#F28C28] underline"
          >
            Open Interactive Graph →
          </button>
        </div>

        {relevantRelationships.length === 0 ? (
          <p className="text-xs text-[#202020]/60 py-4">
            No bilateral relationships documented for this entity yet in the canonical graph.
          </p>
        ) : (
          <div className="space-y-3">
            {relevantRelationships.map((rel) => (
              <div
                key={rel.relationshipId}
                className="p-4 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                    {rel.relationshipType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold">
                    {rel.verificationStatus}
                  </span>
                </div>
                <p className="text-[#202020] leading-relaxed">{rel.description}</p>
                <div className="pt-2 text-[10px] text-[#202020]/60 border-t border-[#202020]/10 flex items-center justify-between">
                  <span>Source Ref: {rel.sourceDocumentReference}</span>
                  <span>Effective From: {rel.validFrom}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer report correction */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => navigate(`/corrections?targetType=entity&targetId=${entity.entityId}&targetName=${encodeURIComponent(entity.canonicalName)}`)}
          className="text-xs font-bold text-[#202020] hover:text-[#F28C28] underline"
        >
          Report an inaccuracy in this entity profile →
        </button>
      </div>
    </div>
  );
};
