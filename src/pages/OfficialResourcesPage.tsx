import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { VERIFIED_OFFICIAL_RESOURCES } from '../data/officialResources';
import { OfficialResource } from '../types';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Filter,
  PhoneCall,
  Calendar,
  Building,
  RotateCcw,
} from 'lucide-react';

export const OfficialResourcesPage: React.FC = () => {
  const { preferences, routeQuery } = useApp();
  const t = getTranslation(preferences.language);

  const initialCat = routeQuery.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const set = new Set(VERIFIED_OFFICIAL_RESOURCES.map((r) => r.category));
    return ['all', ...Array.from(set)];
  }, []);

  const jurisdictions = useMemo(() => {
    const set = new Set(VERIFIED_OFFICIAL_RESOURCES.map((r) => r.jurisdiction));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredResources = useMemo(() => {
    return VERIFIED_OFFICIAL_RESOURCES.filter((res) => {
      const matchCat = selectedCategory === 'all' || res.category === selectedCategory;
      const matchJur = selectedJurisdiction === 'all' || res.jurisdiction === selectedJurisdiction;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        res.name.toLowerCase().includes(q) ||
        (res.name_hi && res.name_hi.includes(q)) ||
        res.description.toLowerCase().includes(q) ||
        res.source_authority.toLowerCase().includes(q) ||
        (res.tags && res.tags.some((t) => t.toLowerCase().includes(q)));
      return matchCat && matchJur && matchQuery;
    });
  }, [selectedCategory, selectedJurisdiction, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedJurisdiction('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Audited Official Repository</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          {t.official_resources.title}
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          {t.official_resources.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#202020]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.official_resources.search_placeholder}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-xl text-xs text-[#202020] focus:border-[#F28C28] focus:bg-white outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#202020]/10 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#202020]/70 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 bg-[#F4F0E6]/50 border border-[#202020]/15 rounded-md text-xs text-[#202020] font-medium"
            >
              <option value="all">All Categories</option>
              {categories.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-[#202020]/70 font-semibold ml-2">
              <span>Jurisdiction:</span>
            </div>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="p-1.5 bg-[#F4F0E6]/50 border border-[#202020]/15 rounded-md text-xs text-[#202020] font-medium"
            >
              <option value="all">All Jurisdictions</option>
              {jurisdictions.filter((j) => j !== 'all').map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {(selectedCategory !== 'all' || selectedJurisdiction !== 'all' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[#F28C28] hover:text-[#D9771E] font-bold underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Resource Count */}
      <div className="flex items-center justify-between text-xs text-[#202020]/60 px-1">
        <span>Showing {filteredResources.length} verified official portals</span>
        <span>All links lead to authentic government domains</span>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-12 text-center space-y-4">
          <p className="text-sm font-bold text-[#202020]">
            {t.official_resources.no_results}
          </p>
          <p className="text-xs text-[#202020]/70 max-w-md mx-auto">
            {t.official_resources.no_results_help}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#F28C28] text-white text-xs font-bold rounded-lg shadow-xs"
          >
            Show All Portals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res: OfficialResource) => (
            <div
              key={res.id}
              className="bg-white border border-[#202020]/15 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#F28C28]/60 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#F28C28] uppercase tracking-wider text-[11px]">
                    {res.jurisdiction}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{res.verification_status.toUpperCase()}</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#202020]">
                    {preferences.language === 'en' ? res.name : res.name_hi || res.name}
                  </h2>
                  <p className="text-xs text-[#202020]/60 mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3 shrink-0" />
                    <span className="truncate">{res.source_authority}</span>
                  </p>
                </div>

                <p className="text-xs text-[#202020]/80 leading-relaxed">
                  {preferences.language === 'en' ? res.description : res.description_hi || res.description}
                </p>

                {res.contact_details && (
                  <div className="p-3 bg-[#F4F0E6]/50 rounded-lg text-xs space-y-1">
                    {res.contact_details.helpline && (
                      <p className="flex items-center gap-1.5 font-bold text-[#202020]">
                        <PhoneCall className="w-3.5 h-3.5 text-[#F28C28]" />
                        <span>Helpline: {res.contact_details.helpline}</span>
                      </p>
                    )}
                    {res.contact_details.address && (
                      <p className="text-[#202020]/70 text-[11px]">
                        Address: {res.contact_details.address}
                      </p>
                    )}
                    {res.contact_details.operating_hours && (
                      <p className="text-[#202020]/60 text-[11px]">
                        Hours: {res.contact_details.operating_hours}
                      </p>
                    )}
                  </div>
                )}

                <div className="p-2.5 bg-neutral-50 rounded-lg text-[11px] text-[#202020]/70 border border-[#202020]/10">
                  <span className="font-semibold text-[#202020]">Audit Note: </span>
                  {res.review_notes}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#202020]/10 flex items-center justify-between text-xs">
                <span className="text-[#202020]/50 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Audited: {res.last_verified_at}</span>
                </span>

                <a
                  href={res.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#202020] hover:bg-[#F28C28] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <span>{t.official_resources.view_source}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
