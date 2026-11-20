import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AdministrativeUnit, AdminUnitType } from '../types';
import {
  MapPin,
  Building,
  ChevronRight,
  Search,
  Filter,
  History,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const AdministrativeGeographyPage: React.FC = () => {
  const { adminUnits, navigate } = useApp();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeUnitId, setActiveUnitId] = useState<string>('dist-kota');

  const unitTypes: { value: string; label: string }[] = [
    { value: 'all', label: 'All Administrative Levels' },
    { value: 'state', label: 'States' },
    { value: 'union_territory', label: 'Union Territories' },
    { value: 'district', label: 'Districts' },
    { value: 'tehsil', label: 'Tehsils / Taluks' },
    { value: 'urban_local_body', label: 'Urban Local Bodies (Nagar Nigam)' },
  ];

  const filteredUnits = useMemo(() => {
    return adminUnits.filter((u) => {
      const matchType = selectedType === 'all' || u.unitType === selectedType;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        u.officialName.toLowerCase().includes(q) ||
        (u.localName && u.localName.includes(q)) ||
        u.officialCode.includes(q);
      return matchType && matchQuery;
    });
  }, [adminUnits, selectedType, searchQuery]);

  const activeUnit = useMemo(() => {
    return adminUnits.find((u) => u.id === activeUnitId) || adminUnits[0];
  }, [adminUnits, activeUnitId]);

  const parentUnit = useMemo(() => {
    return adminUnits.find((u) => u.id === activeUnit.parentUnitId);
  }, [adminUnits, activeUnit]);

  const childUnits = useMemo(() => {
    return adminUnits.filter((u) => u.parentUnitId === activeUnit.id);
  }, [adminUnits, activeUnit]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Local Government Directory (LGD) Hierarchy</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          India Administrative Geography Registry
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Canonical structural records preserving official hierarchies, state-specific nomenclature (Tehsils, Taluks, Mandals), official LGD codes, and historical reorganization notices.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#202020]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search administrative units by name or official code..."
            className="w-full pl-9 pr-3 py-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#202020]/60 shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-semibold text-[#202020]"
          >
            {unitTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Split: List on Left, Active Hierarchy & History on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List */}
        <div className="lg:col-span-5 bg-white border border-[#202020]/15 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-[#202020]/70 font-semibold border-b border-[#202020]/10 pb-2">
            <span>Official Units ({filteredUnits.length})</span>
            <span>Click to Inspect</span>
          </div>

          <div className="divide-y divide-[#202020]/10 max-h-[600px] overflow-y-auto">
            {filteredUnits.map((u) => (
              <button
                key={u.id}
                onClick={() => setActiveUnitId(u.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                  activeUnitId === u.id ? 'bg-[#FDF3E7] font-bold text-[#202020]' : 'hover:bg-[#F4F0E6]/40 text-[#202020]/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202020]">{u.officialName}</span>
                    {u.localName && (
                      <span className="text-[11px] text-[#202020]/60 font-hindi">({u.localName})</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#202020]/60 mt-0.5">
                    Level: {u.unitType.replace('_', ' ').toUpperCase()} · Code: {u.officialCode}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#202020]/30" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Detail Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  Canonical Record · {activeUnit.unitType.replace('_', ' ').toUpperCase()}
                </span>
                <h2 className="text-2xl font-black text-[#202020] mt-1">
                  {activeUnit.officialName}
                </h2>
                {activeUnit.localName && (
                  <p className="text-sm font-hindi text-[#202020]/75 mt-0.5">
                    {activeUnit.localName}
                  </p>
                )}
              </div>

              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-sm flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>LGD VERIFIED</span>
              </span>
            </div>

            {/* Parent Unit Link */}
            {parentUnit && (
              <div className="p-3 bg-[#F4F0E6]/50 rounded-xl border border-[#202020]/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#202020]/60">Parent Administrative Unit:</span>
                  <p className="font-bold text-[#202020]">{parentUnit.officialName} ({parentUnit.unitType})</p>
                </div>
                <button
                  onClick={() => setActiveUnitId(parentUnit.id)}
                  className="px-2.5 py-1 bg-white hover:bg-[#F28C28] hover:text-white rounded border border-[#202020]/20 text-[11px] font-bold transition-colors"
                >
                  Inspect Parent Unit
                </button>
              </div>
            )}

            {/* Structured Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#F4F0E6]/30 p-4 rounded-xl border border-[#202020]/10">
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Official Code</span>
                <p className="font-mono font-bold text-[#202020]">{activeUnit.officialCode}</p>
                <span className="text-[9px] text-[#202020]/50">{activeUnit.codeSystem} Standard</span>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Coordinates</span>
                <p className="font-mono text-[11px] text-[#202020]">{activeUnit.centroidLatitude.toFixed(2)}°N, {activeUnit.centroidLongitude.toFixed(2)}°E</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Status</span>
                <p className="font-bold text-emerald-700 capitalize">{activeUnit.administrativeStatus}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Valid From</span>
                <p className="font-medium text-[#202020]">{activeUnit.validFrom}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Source Dataset</span>
                <p className="font-medium text-[#202020]">{activeUnit.sourceVersion}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Last Audited</span>
                <p className="font-medium text-[#202020]">{activeUnit.lastVerifiedAt}</p>
              </div>
            </div>

            {/* Subordinate Units */}
            {childUnits.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase text-[#202020]">
                  Subordinate Units ({childUnits.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {childUnits.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveUnitId(child.id)}
                      className="p-2.5 bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-lg text-left text-xs transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#202020]">{child.officialName}</p>
                        <p className="text-[10px] text-[#202020]/60">{child.unitType} · Code {child.officialCode}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#202020]/40" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Historical Reorganization Notes if applicable */}
            {activeUnit.id.includes('nn-') && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-950">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <History className="w-4 h-4 text-amber-700" />
                  <span>Administrative Reorganization History</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Bifurcated from erstwhile single Municipal Corporation Kota via Rajasthan State Gazette Notification dated October 18, 2019 to improve urban governance density across 150 total wards.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#202020]/10 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/india-map`)}
                className="px-4 py-2 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>View on National Map</span>
              </button>
              <button
                onClick={() => navigate(`/corrections?targetType=geography&targetId=${activeUnit.id}&targetName=${encodeURIComponent(activeUnit.officialName)}`)}
                className="px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-xs font-bold text-[#202020] rounded-lg transition-colors"
              >
                Report Geographic Correction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
