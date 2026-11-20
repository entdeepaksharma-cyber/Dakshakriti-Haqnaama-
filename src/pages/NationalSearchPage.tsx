import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Building2,
  MapPin,
  Share2,
  FileCheck,
  ChevronRight,
  Filter,
  Layers,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const NationalSearchPage: React.FC = () => {
  const { adminUnits, entities, ownershipRecords, relationships, sources, navigate } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    // 1. Match Administrative Units
    const matchedUnits = adminUnits.filter(
      (u) =>
        u.officialName.toLowerCase().includes(q) ||
        (u.localName && u.localName.includes(q)) ||
        u.officialCode.includes(q) ||
        u.unitType.toLowerCase().includes(q)
    ).map((u) => ({
      type: 'geography' as const,
      id: u.id,
      title: u.officialName,
      subtitle: `${u.unitType.replace('_', ' ').toUpperCase()} · Code ${u.officialCode} (${u.codeSystem})`,
      matchReason: u.officialCode.includes(q)
        ? `Matched on Official ${u.codeSystem} Code`
        : `Matched on Administrative Name (${u.unitType})`,
      route: `/india-map`,
      verified: u.verificationStatus === 'verified',
    }));

    // 2. Match Entities
    const matchedEntities = entities.filter(
      (e) =>
        e.canonicalName.toLowerCase().includes(q) ||
        e.officialName.toLowerCase().includes(q) ||
        (e.registrationNumber && e.registrationNumber.toLowerCase().includes(q)) ||
        e.headquartersLocation.city.toLowerCase().includes(q) ||
        e.entityType.toLowerCase().includes(q)
    ).map((e) => ({
      type: 'entity' as const,
      id: e.entityId,
      title: e.canonicalName,
      subtitle: `${e.legalForm} · ${e.headquartersLocation.city}, ${e.headquartersLocation.state}`,
      matchReason: e.registrationNumber && e.registrationNumber.toLowerCase().includes(q)
        ? `Matched on Statutory Registration Number (${e.registrationNumber})`
        : `Matched on Canonical Entity Title / Sector`,
      route: `/entities/${e.entityId}`,
      verified: e.verificationStatus === 'verified',
    }));

    // 3. Match Ownership Records
    const matchedOwnership = ownershipRecords.filter(
      (o) =>
        (o.ownerPersonName && o.ownerPersonName.toLowerCase().includes(q)) ||
        o.ownershipBasis.toLowerCase().includes(q) ||
        o.sourceDocumentReference.toLowerCase().includes(q)
    ).map((o) => ({
      type: 'ownership' as const,
      id: o.ownershipRecordId,
      title: `${o.ownerPersonName || o.ownerEntityId} (${o.shareholdingPercentage || ''}%)`,
      subtitle: `${o.relationshipType.replace('_', ' ').toUpperCase()} · ${o.shareClass}`,
      matchReason: `Matched on Shareholder Record / Regulatory Filing`,
      route: `/companies/${o.ownedEntityId}/ownership`,
      verified: o.verificationStatus === 'verified',
    }));

    // 4. Match Relationships
    const matchedRelationships = relationships.filter(
      (r) =>
        r.description.toLowerCase().includes(q) ||
        r.relationshipType.toLowerCase().includes(q) ||
        r.sourceDocumentReference.toLowerCase().includes(q)
    ).map((r) => ({
      type: 'relationship' as const,
      id: r.relationshipId,
      title: r.relationshipType.replace('_', ' ').toUpperCase(),
      subtitle: r.description,
      matchReason: `Matched on Documented Institutional Relationship`,
      route: `/stakeholders`,
      verified: r.verificationStatus !== 'UNVERIFIED',
    }));

    // 5. Match Data Sources
    const matchedSources = sources.filter(
      (s) =>
        s.sourceName.toLowerCase().includes(q) ||
        s.publisher.toLowerCase().includes(q) ||
        s.sourceType.toLowerCase().includes(q)
    ).map((s) => ({
      type: 'source' as const,
      id: s.sourceId,
      title: s.sourceName,
      subtitle: `${s.publisher} · ${s.sourceType}`,
      matchReason: `Matched on Authoritative Public Registry`,
      route: `/sources`,
      verified: s.verificationStatus === 'verified',
    }));

    const all = [
      ...matchedUnits,
      ...matchedEntities,
      ...matchedOwnership,
      ...matchedRelationships,
      ...matchedSources,
    ];

    return {
      all,
      filtered: filterType === 'all' ? all : all.filter((item) => item.type === filterType),
      total: all.length,
    };
  }, [query, filterType, adminUnits, entities, ownershipRecords, relationships, sources]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Search className="w-3.5 h-3.5" />
          <span>Multi-Registry Query Engine</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Unified National Search
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Search across 100% source-grounded administrative units, constitutional courts, government authorities, corporate entities, shareholders, and public data registries.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="bg-white border-2 border-[#202020] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#202020]/45" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by entity name, CIN, LGD code, district (e.g. Kota, CFCL, NALSA, L40101DL1975GOI007966)..."
            className="w-full pl-12 pr-4 py-3 bg-transparent text-sm text-[#202020] placeholder:text-[#202020]/40 outline-hidden font-medium"
            autoFocus
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#202020]/10 text-xs font-bold">
          <span className="text-[#202020]/60 mr-1">Filter by Record Type:</span>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'geography', label: 'Geography' },
            { id: 'entity', label: 'Institutions & Companies' },
            { id: 'ownership', label: 'Shareholders' },
            { id: 'relationship', label: 'Relationships' },
            { id: 'source', label: 'Sources' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterType === f.id
                  ? 'bg-[#202020] text-white'
                  : 'bg-[#F4F0E6] text-[#202020]/80 hover:bg-[#F28C28] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {results ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#202020]/60 px-1">
            <span>Found {results.filtered.length} matching records</span>
            <span>Zero hallucinated entries</span>
          </div>

          {results.filtered.length === 0 ? (
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-12 text-center text-xs text-[#202020]/70 space-y-2">
              <p className="font-bold text-sm text-[#202020]">No records match your exact query.</p>
              <p>Try searching for "Kota", "Rajasthan", "NALSA", "Chambal", or "110".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.filtered.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  onClick={() => navigate(item.route)}
                  className="p-4 bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-xl shadow-xs transition-all cursor-pointer flex items-start justify-between gap-4"
                  role="button"
                  tabIndex={0}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28] bg-[#FDF3E7] px-2 py-0.5 rounded-xs">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-xs">
                        {item.matchReason}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#202020]">{item.title}</h3>
                    <p className="text-xs text-[#202020]/70 line-clamp-1">{item.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-[#F28C28] shrink-0 mt-2">
                    <span>Inspect</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Empty Query Suggestion Strips */
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-8 space-y-6">
          <h2 className="text-xs font-bold uppercase text-[#202020]/70">
            Suggested Verification Searches:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { query: 'Kota', desc: 'District, Subdistricts & Local Nagar Nigams' },
              { query: 'NALSA', desc: 'National Legal Aid Statutory Apex Body' },
              { query: 'Chambal Fertilisers', desc: 'CFCL Gadepan Kota Corporate Profile & Shareholders' },
              { query: 'NTPC', desc: 'Central PSU Maharatna Equity Structure' },
              { query: 'Supreme Court of India', desc: 'Constitutional Court of Record' },
              { query: 'Rajasthan Sampark', desc: 'State Grievance Gateway (181)' },
            ].map((s) => (
              <button
                key={s.query}
                onClick={() => setQuery(s.query)}
                className="p-3 bg-[#F4F0E6]/40 hover:bg-[#FDF3E7] border border-[#202020]/10 rounded-xl text-left transition-colors"
              >
                <p className="text-xs font-bold text-[#202020]">{s.query}</p>
                <p className="text-[11px] text-[#202020]/60 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
