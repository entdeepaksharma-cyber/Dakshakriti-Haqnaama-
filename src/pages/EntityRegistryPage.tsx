import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NationalEntity, EntityCategory, VerificationStatus } from '../types';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MapPin,
  Scale,
  Briefcase,
  Share2,
} from 'lucide-react';

interface Props {
  initialType?: string;
  pageTitle?: string;
}

export const EntityRegistryPage: React.FC<Props> = ({ initialType = 'all', pageTitle }) => {
  const { entities, navigate } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialType);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  const categories: { value: string; label: string }[] = [
    { value: 'all', label: 'All Entity Types' },
    { value: 'court_tribunal', label: 'Courts & Tribunals' },
    { value: 'legal_aid_authority', label: 'Legal Aid Authorities (NALSA/DLSA)' },
    { value: 'district_administration', label: 'District Administration' },
    { value: 'local_body', label: 'Municipal & Local Bodies' },
    { value: 'registered_company', label: 'Registered Companies' },
    { value: 'public_enterprise', label: 'Public Enterprises (PSUs)' },
  ];

  const filteredEntities = useMemo(() => {
    return entities.filter((ent) => {
      const matchCat = selectedCategory === 'all' || ent.entityType === selectedCategory;
      const matchJur =
        selectedJurisdiction === 'all' ||
        ent.jurisdictionId === selectedJurisdiction ||
        (selectedJurisdiction === 'rj-kota' && (ent.jurisdictionId.includes('kota') || ent.headquartersLocation.city === 'Kota'));

      const matchVerif = verificationFilter === 'all' || ent.verificationStatus === verificationFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        ent.canonicalName.toLowerCase().includes(q) ||
        ent.officialName.toLowerCase().includes(q) ||
        (ent.registrationNumber && ent.registrationNumber.toLowerCase().includes(q)) ||
        ent.headquartersLocation.city.toLowerCase().includes(q);

      return matchCat && matchJur && matchVerif && matchQuery;
    });
  }, [entities, selectedCategory, selectedJurisdiction, verificationFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Canonical Institutional Registry</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {pageTitle || 'National Entity & Institutional Registry'}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Comprehensive directory of constitutional authorities, district administration, legal aid bodies, public utilities, and registered corporate entities with source-verified identification records.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#202020]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by entity name, CIN, or city..."
              className="w-full pl-9 pr-3 py-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-semibold text-[#202020]"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Jurisdiction */}
          <div>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-semibold text-[#202020]"
            >
              <option value="all">All Jurisdictions</option>
              <option value="in">All-India (National)</option>
              <option value="rj">State of Rajasthan</option>
              <option value="rj-kota">Kota District (Rajasthan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count & Status */}
      <div className="flex items-center justify-between text-xs text-[#202020]/60 px-1">
        <span>Showing {filteredEntities.length} verified records</span>
        <span>Source-backed by MCA21 / eCourts / NALSA / LGD</span>
      </div>

      {/* Entities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntities.map((ent) => (
          <div
            key={ent.entityId}
            className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs hover:border-[#F28C28] transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  {ent.entityType.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-800 rounded-sm flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>VERIFIED</span>
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#202020] line-clamp-1">{ent.canonicalName}</h2>
                <p className="text-xs text-[#202020]/60 mt-0.5">{ent.legalForm}</p>
              </div>

              <p className="text-xs text-[#202020]/75 line-clamp-2 leading-relaxed">
                {ent.summary || ent.officialName}
              </p>

              {ent.registrationNumber && (
                <div className="p-2 bg-[#F4F0E6]/40 rounded-lg text-[10px] font-mono text-[#202020]/80">
                  <span className="font-bold">Official ID: </span>
                  {ent.registrationNumber} ({ent.registrationAuthority})
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-[#202020]/70">
                <MapPin className="w-3.5 h-3.5 text-[#F28C28] shrink-0" />
                <span className="truncate">{ent.headquartersLocation.city}, {ent.headquartersLocation.state}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#202020]/10 flex items-center justify-between text-xs">
              {ent.entityType === 'registered_company' || ent.entityType === 'public_enterprise' ? (
                <button
                  onClick={() => navigate(`/companies/${ent.entityId}/ownership`)}
                  className="text-xs font-semibold text-[#202020] hover:text-[#F28C28] underline flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3 text-[#F28C28]" />
                  <span>Ownership Structure</span>
                </button>
              ) : (
                <span className="text-[11px] text-[#202020]/50">Audited: {ent.lastVerifiedAt}</span>
              )}

              <button
                onClick={() => navigate(`/entities/${ent.entityId}`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#202020] hover:bg-[#F28C28] text-white font-bold text-xs rounded-md transition-colors"
              >
                <span>View Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
