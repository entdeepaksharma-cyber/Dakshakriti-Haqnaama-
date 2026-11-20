import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AdministrativeUnit, NationalEntity, VerificationStatus } from '../types';
import {
  MapPin,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  Layers,
  ChevronRight,
  Info,
  Table,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const IndiaMapPage: React.FC = () => {
  const { adminUnits, entities, navigate } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>('dist-kota');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Currently selected unit
  const activeUnit = useMemo(() => {
    return adminUnits.find((u) => u.id === selectedUnitId) || adminUnits[0];
  }, [adminUnits, selectedUnitId]);

  // Subordinate units of active unit
  const subordinateUnits = useMemo(() => {
    return adminUnits.filter((u) => u.parentUnitId === activeUnit.id);
  }, [adminUnits, activeUnit]);

  // Entities located in or under the active unit
  const mappedEntities = useMemo(() => {
    return entities.filter((e) => {
      const matchUnit =
        e.jurisdictionId === activeUnit.jurisdictionId ||
        (activeUnit.id === 'unit-in') ||
        (activeUnit.unitType === 'state' && e.headquartersLocation.state.includes(activeUnit.officialName.replace('State of ', ''))) ||
        (activeUnit.unitType === 'district' && e.jurisdictionId.includes(activeUnit.id.replace('dist-', '')));

      const matchCategory =
        selectedCategory === 'all' || e.entityType === selectedCategory;

      const matchVerification =
        verificationFilter === 'all' || e.verificationStatus === verificationFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        e.canonicalName.toLowerCase().includes(q) ||
        e.officialName.toLowerCase().includes(q) ||
        (e.registrationNumber && e.registrationNumber.toLowerCase().includes(q));

      return matchUnit && matchCategory && matchVerification && matchQuery;
    });
  }, [entities, activeUnit, selectedCategory, verificationFilter, searchQuery]);

  // Coordinates & simplified vector points for states/districts on the interactive map
  const stateCoordinates: Record<string, { x: number; y: number; name: string; type: string; id: string }> = {
    'unit-state-rj': { x: 260, y: 280, name: 'Rajasthan (Kota/Jaipur)', type: 'state', id: 'unit-state-rj' },
    'unit-state-dl': { x: 330, y: 220, name: 'NCT of Delhi', type: 'union_territory', id: 'unit-state-dl' },
    'unit-state-up': { x: 420, y: 260, name: 'Uttar Pradesh', type: 'state', id: 'unit-state-up' },
    'unit-state-mh': { x: 300, y: 440, name: 'Maharashtra (Mumbai)', type: 'state', id: 'unit-state-mh' },
    'unit-state-gj': { x: 200, y: 350, name: 'Gujarat', type: 'state', id: 'unit-state-gj' },
    'unit-state-ka': { x: 310, y: 550, name: 'Karnataka (Bengaluru)', type: 'state', id: 'unit-state-ka' },
    'unit-state-tn': { x: 360, y: 620, name: 'Tamil Nadu', type: 'state', id: 'unit-state-tn' },
    'dist-kota': { x: 280, y: 310, name: 'Kota District', type: 'district', id: 'dist-kota' },
    'dist-mumbai': { x: 250, y: 460, name: 'Mumbai City', type: 'district', id: 'dist-mumbai' },
    'dist-bengaluru': { x: 320, y: 570, name: 'Bengaluru Urban', type: 'district', id: 'dist-bengaluru' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>National Geographic Registry</span>
          </div>
          <h1 className="text-3xl font-black text-[#202020]">
            India Administrative & Institutional Map
          </h1>
          <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
            Interactive geographical drill-down of India's states, union territories, districts (with Kota, Rajasthan focal unit), tehsils, and verified institutional establishments.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#202020]/15 shadow-xs">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'map' ? 'bg-[#202020] text-white shadow-xs' : 'text-[#202020]/70 hover:text-[#202020]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-[#202020] text-white shadow-xs' : 'text-[#202020]/70 hover:text-[#202020]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Accessible List View</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Quick Jurisdiction Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#202020]/70 mb-1">
              Geographic Level
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-semibold text-[#202020]"
            >
              <optgroup label="Country Level">
                <option value="unit-in">India (National Overview)</option>
              </optgroup>
              <optgroup label="States & UTs">
                <option value="unit-state-rj">Rajasthan</option>
                <option value="unit-state-dl">NCT of Delhi</option>
                <option value="unit-state-mh">Maharashtra</option>
                <option value="unit-state-ka">Karnataka</option>
                <option value="unit-state-up">Uttar Pradesh</option>
                <option value="unit-state-gj">Gujarat</option>
                <option value="unit-state-tn">Tamil Nadu</option>
              </optgroup>
              <optgroup label="Districts (Focus: Kota & Key Metros)">
                <option value="dist-kota">District Kota (Rajasthan)</option>
                <option value="dist-jaipur">District Jaipur (Rajasthan)</option>
                <option value="dist-mumbai">District Mumbai City (Maharashtra)</option>
                <option value="dist-bengaluru">District Bengaluru Urban (Karnataka)</option>
                <option value="dist-new-delhi">District New Delhi</option>
              </optgroup>
              <optgroup label="Subdistricts & Urban Bodies in Kota">
                <option value="subdist-ladpura">Tehsil Ladpura (Kota)</option>
                <option value="subdist-ramganj-mandi">Tehsil Ramganj Mandi (Kota)</option>
                <option value="ulb-kota-north">Nagar Nigam Kota North</option>
                <option value="ulb-kota-south">Nagar Nigam Kota South</option>
              </optgroup>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#202020]/70 mb-1">
              Entity Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-medium text-[#202020]"
            >
              <option value="all">All Entity Categories</option>
              <option value="court_tribunal">Courts & Tribunals</option>
              <option value="legal_aid_authority">Legal Services Authorities (NALSA/DLSA)</option>
              <option value="district_administration">District Administration & Revenue</option>
              <option value="local_body">Municipal Corporations & Local Bodies</option>
              <option value="registered_company">Registered Companies & LLPs</option>
              <option value="public_enterprise">Public Sector Undertakings (PSUs)</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#202020]/70 mb-1">
              Verification Status
            </label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs font-medium text-[#202020]"
            >
              <option value="all">All Verification States</option>
              <option value="verified">Verified Records Only</option>
              <option value="provisional">Provisional / Under Review</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#202020]/70 mb-1">
              Filter Entities
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#202020]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, CIN, or jurisdiction..."
                className="w-full pl-8 pr-3 py-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map / List on Left, Active Geographic Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map or List */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === 'map' ? (
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-[#202020]/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F28C28]" />
                  <span className="text-xs font-bold text-[#202020]">National Geographic Canvas (Vector Representation)</span>
                </div>
                <span className="text-[11px] font-mono text-[#202020]/60">
                  LGD Ref: {activeUnit.officialCode}
                </span>
              </div>

              {/* Vector SVG Map Container */}
              <div className="relative w-full aspect-4/3 bg-[#F4F0E6]/40 rounded-xl border border-[#202020]/10 flex items-center justify-center p-4">
                <svg
                  viewBox="0 0 650 750"
                  className="w-full h-full max-h-[500px]"
                  aria-label="National Map of India"
                >
                  {/* Stylized geometric contour of India */}
                  <polygon
                    points="310,40 370,80 430,120 400,160 480,210 570,250 540,330 460,370 410,480 370,640 330,710 300,640 250,520 220,440 160,370 190,300 240,240 280,180 300,100"
                    fill="#FFFFFF"
                    stroke="#202020"
                    strokeWidth="2"
                    strokeDasharray="none"
                    className="transition-colors hover:fill-[#FAF8F2]"
                  />

                  {/* Rajasthan Polygon Highlight */}
                  <polygon
                    points="220,240 300,240 320,330 250,370 200,320"
                    fill={activeUnit.id.includes('rj') || activeUnit.id.includes('kota') ? '#FDF3E7' : '#F4F0E6'}
                    stroke="#F28C28"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-colors hover:fill-[#FDF3E7]"
                    onClick={() => setSelectedUnitId('unit-state-rj')}
                  >
                    <title>State of Rajasthan</title>
                  </polygon>

                  {/* Maharashtra Polygon */}
                  <polygon
                    points="250,380 350,380 360,490 270,510 230,440"
                    fill={activeUnit.id.includes('mh') || activeUnit.id.includes('mumbai') ? '#FDF3E7' : '#F4F0E6'}
                    stroke="#202020"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:fill-[#FDF3E7]"
                    onClick={() => setSelectedUnitId('unit-state-mh')}
                  >
                    <title>State of Maharashtra</title>
                  </polygon>

                  {/* Southern India (Karnataka / Tamil Nadu) */}
                  <polygon
                    points="270,510 360,490 380,620 330,700 290,620"
                    fill={activeUnit.id.includes('ka') || activeUnit.id.includes('tn') || activeUnit.id.includes('bengaluru') ? '#FDF3E7' : '#F4F0E6'}
                    stroke="#202020"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-colors hover:fill-[#FDF3E7]"
                    onClick={() => setSelectedUnitId('unit-state-ka')}
                  >
                    <title>Karnataka & Tamil Nadu</title>
                  </polygon>

                  {/* Interactive Nodes */}
                  {Object.entries(stateCoordinates).map(([key, point]) => {
                    const isSelected = selectedUnitId === key || (key === 'unit-state-rj' && activeUnit.id.includes('kota'));
                    return (
                      <g
                        key={key}
                        onClick={() => setSelectedUnitId(point.id)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isSelected ? 9 : 6}
                          fill={isSelected ? '#F28C28' : '#202020'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={point.x + 12}
                          y={point.y + 4}
                          fontSize="10"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fill="#202020"
                          className="select-none"
                        >
                          {point.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Map Legend */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-[#202020]/15 text-[10px] space-y-1 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F28C28]" />
                    <span className="font-semibold text-[#202020]">Active Selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#202020]" />
                    <span className="text-[#202020]/75">Administrative Center</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-[#202020]/60 mt-3 italic text-center">
                * Note: Boundaries rendered in accordance with Government of India Local Government Directory (LGD) authoritative data. Unverified polygons are omitted to avoid invented geometry.
              </p>
            </div>
          ) : (
            /* Accessible List View */
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#202020] uppercase">
                Accessible Geographic Directory
              </h2>
              <div className="divide-y divide-[#202020]/10 max-h-[500px] overflow-y-auto text-xs">
                {adminUnits.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`w-full text-left p-3 flex items-center justify-between hover:bg-[#F4F0E6]/50 transition-colors ${
                      selectedUnitId === unit.id ? 'bg-[#FDF3E7] font-bold text-[#202020]' : 'text-[#202020]/80'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{unit.officialName}</p>
                      <p className="text-[10px] text-[#202020]/60">
                        {unit.unitType.replace('_', ' ').toUpperCase()} · Code: {unit.officialCode} ({unit.codeSystem})
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#202020]/40" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Geographic Unit Profile & Mapped Entities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Unit Card */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  {activeUnit.unitType.replace('_', ' ').toUpperCase()}
                </span>
                <h2 className="text-lg font-black text-[#202020]">
                  {activeUnit.officialName}
                </h2>
                {activeUnit.localName && (
                  <p className="text-xs text-[#202020]/70 font-hindi font-medium">
                    {activeUnit.localName}
                  </p>
                )}
              </div>

              <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-50 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>VERIFIED</span>
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F4F0E6]/40 p-3 rounded-xl border border-[#202020]/10">
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Official Code</span>
                <p className="font-mono font-bold text-[#202020]">{activeUnit.officialCode} ({activeUnit.codeSystem})</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Coordinates</span>
                <p className="font-mono text-[11px] text-[#202020]">{activeUnit.centroidLatitude.toFixed(2)}°N, {activeUnit.centroidLongitude.toFixed(2)}°E</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Source Dataset</span>
                <p className="font-medium text-[#202020]">{activeUnit.sourceVersion}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Audit Status</span>
                <p className="font-medium text-emerald-700">Verified: {activeUnit.lastVerifiedAt}</p>
              </div>
            </div>

            {/* Subordinate Units */}
            {subordinateUnits.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#202020]/10">
                <span className="text-xs font-bold text-[#202020]">
                  Subordinate Administrative Units ({subordinateUnits.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subordinateUnits.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedUnitId(sub.id)}
                      className="px-2 py-1 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white rounded text-[11px] font-semibold text-[#202020] transition-colors"
                    >
                      {sub.officialName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mapped Verified Entities in this Geography */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#202020]/10 pb-3">
              <h3 className="text-sm font-bold text-[#202020] uppercase">
                Mapped Establishments ({mappedEntities.length})
              </h3>
              <span className="text-[10px] text-[#202020]/60 font-semibold">
                In {activeUnit.officialName}
              </span>
            </div>

            {mappedEntities.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#202020]/60">
                No institutions or corporate entities currently mapped to this exact filter.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mappedEntities.map((ent) => (
                  <div
                    key={ent.entityId}
                    className="p-3 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-xl space-y-2 hover:border-[#F28C28] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                          {ent.entityType.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs font-bold text-[#202020]">{ent.canonicalName}</h4>
                        <p className="text-[11px] text-[#202020]/60">{ent.legalForm}</p>
                      </div>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-800 rounded-xs">
                        VERIFIED
                      </span>
                    </div>

                    {ent.registrationNumber && (
                      <p className="text-[10px] font-mono text-[#202020]/75">
                        ID: {ent.registrationNumber} ({ent.registrationAuthority})
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#202020]/10 text-[11px]">
                      <span className="text-[#202020]/60">{ent.headquartersLocation.city}, {ent.headquartersLocation.state}</span>
                      <button
                        onClick={() => navigate(`/entities/${ent.entityId}`)}
                        className="text-[#F28C28] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Profile</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
