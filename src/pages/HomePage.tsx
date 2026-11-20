import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  MapPin,
  Building2,
  Share2,
  Layers,
  Search,
  ArrowRight,
  ShieldCheck,
  Scale,
  FileText,
  BarChart3,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { preferences, navigate, adminUnits, entities, ownershipRecords, relationships, sources } = useApp();
  const t = getTranslation(preferences.language);
  const [quickSearch, setQuickSearch] = useState('');

  // Live metrics derived from actual persisted data
  const stats = useMemo(() => {
    return {
      unitsCount: adminUnits.length,
      entitiesCount: entities.length,
      relationshipsCount: relationships.length,
      sourcesCount: sources.length,
      companiesCount: entities.filter((e) => e.entityType === 'registered_company' || e.entityType === 'public_enterprise').length,
    };
  }, [adminUnits, entities, relationships, sources]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
    }
  };

  return (
    <div className="space-y-14 pb-20">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14 pb-12 border-b border-[#202020]/10 bg-linear-to-b from-white/40 to-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#202020]/15 rounded-md text-xs font-bold text-[#202020] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F28C28]" />
            <span>HAQNAAMA · India Geographic, Institutional & Stakeholder Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#202020] tracking-tight leading-[1.15] [text-wrap:balance]">
            National Stakeholder Mapping & Administrative Geography
          </h1>

          <p className="text-sm sm:text-base text-[#202020]/80 max-w-2xl mx-auto leading-relaxed">
            A standalone intelligence platform mapping India's administrative hierarchy, public institutions, registered companies, publicly disclosed shareholders, and source-backed stakeholder relationships.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative shadow-md rounded-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#202020]/45" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search district, entity, CIN, or shareholder (e.g. Kota, NALSA, CFCL, NTPC)..."
                className="w-full pl-12 pr-28 py-3.5 bg-white border-2 border-[#202020]/25 focus:border-[#F28C28] text-sm text-[#202020] rounded-xl outline-hidden font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Primary Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/india-map')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Explore India Map</span>
            </button>
            <button
              onClick={() => navigate('/geography')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-xs font-bold text-[#202020] rounded-lg shadow-xs transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Administrative Geography</span>
            </button>
            <button
              onClick={() => navigate('/stakeholders')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-xs font-bold text-[#202020] rounded-lg shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#F28C28]" />
              <span>Stakeholder Graph</span>
            </button>
            <button
              onClick={() => navigate('/rights-navigator')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4F0E6] border border-[#202020]/20 hover:bg-[#F28C28] hover:text-white text-xs font-bold text-[#202020] rounded-lg shadow-xs transition-colors"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Rights Navigator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real Metric Counters Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/geography')}
            className="p-5 bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-2xl shadow-xs cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Administrative Units</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{stats.unitsCount}</p>
            <p className="text-[11px] text-[#202020]/75">LGD Code Verified</p>
          </div>

          <div
            onClick={() => navigate('/entities')}
            className="p-5 bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-2xl shadow-xs cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">National Entities</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{stats.entitiesCount}</p>
            <p className="text-[11px] text-[#202020]/75">Courts, PSUs & Authorities</p>
          </div>

          <div
            onClick={() => navigate('/companies')}
            className="p-5 bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-2xl shadow-xs cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Corporate Filings</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{stats.companiesCount}</p>
            <p className="text-[11px] text-[#202020]/75">CIN & Form MGT-7 Disclosed</p>
          </div>

          <div
            onClick={() => navigate('/stakeholders')}
            className="p-5 bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-2xl shadow-xs cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-[#202020]/60">Documented Edges</span>
            <p className="text-3xl font-black text-[#202020] font-mono tabular-nums">{stats.relationshipsCount}</p>
            <p className="text-[11px] text-emerald-700 font-semibold">100% Traceable Evidence</p>
          </div>
        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
              National Intelligence Engines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#202020] mt-1">
              Core Registry Modules
            </h2>
          </div>
          <button
            onClick={() => navigate('/coverage')}
            className="text-xs font-bold text-[#202020] hover:text-[#F28C28] underline flex items-center gap-1"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>Inspect Data Quality & Coverage →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: India Map & Geography */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202020]">National Map & LGD Geography</h3>
              <p className="text-xs text-[#202020]/75 leading-relaxed">
                Explore 36 States & UTs with district-level drill-down (including Kota, Rajasthan focal unit, Jaipur, Mumbai, and Delhi). Inspect tehsils, mandals, and urban local bodies.
              </p>
            </div>
            <button
              onClick={() => navigate('/india-map')}
              className="w-full py-2 px-3 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white rounded-lg text-xs font-bold text-[#202020] transition-colors flex items-center justify-between"
            >
              <span>Launch Interactive Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Entity & Institutional Registry */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202020]">Entity & Institutional Profiles</h3>
              <p className="text-xs text-[#202020]/75 leading-relaxed">
                Canonical profiles for the Supreme Court, NALSA, Rajasthan High Court, Kota DLSA, Nagar Nigam, and registered corporate giants like Chambal Fertilisers and NTPC.
              </p>
            </div>
            <button
              onClick={() => navigate('/entities')}
              className="w-full py-2 px-3 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white rounded-lg text-xs font-bold text-[#202020] transition-colors flex items-center justify-between"
            >
              <span>Browse Entity Registry</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Shareholder & Corporate Ownership */}
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] flex items-center justify-center text-[#F28C28]">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202020]">Shareholders & Ownership</h3>
              <p className="text-xs text-[#202020]/75 leading-relaxed">
                Source-backed corporate ownership derived strictly from statutory MCA Form MGT-7 filings and SEBI Reg 31 disclosures. No AI estimates for undisclosed holdings.
              </p>
            </div>
            <button
              onClick={() => navigate('/companies')}
              className="w-full py-2 px-3 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white rounded-lg text-xs font-bold text-[#202020] transition-colors flex items-center justify-between"
            >
              <span>Inspect Shareholdings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Kota & Rajasthan Focal Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020]/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                Focal District Spotlight
              </span>
              <h3 className="text-lg font-bold text-[#202020]">
                Kota District, Rajasthan (LGD Code: 110)
              </h3>
            </div>
            <span className="text-xs text-[#202020]/60">
              6 Tehsils · 2 Nagar Nigams · 28 Mapped Establishments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#F4F0E6]/30 rounded-xl border border-[#202020]/10 space-y-1.5">
              <span className="font-bold text-[#202020]">Administrative & Civic</span>
              <p className="text-[#202020]/75">
                District Collectorate Kota, Nagar Nigam Kota North (70 wards), and Nagar Nigam Kota South (80 wards).
              </p>
              <button onClick={() => navigate('/geography')} className="text-[#F28C28] font-bold underline text-[11px] block pt-1">
                View Kota LGD Units →
              </button>
            </div>

            <div className="p-4 bg-[#F4F0E6]/30 rounded-xl border border-[#202020]/10 space-y-1.5">
              <span className="font-bold text-[#202020]">Judiciary & Legal Aid</span>
              <p className="text-[#202020]/75">
                District & Sessions Court Kota (Nayapura) and DLSA Kota Front Office (Free legal representation under Section 12).
              </p>
              <button onClick={() => navigate('/legal-aid')} className="text-[#F28C28] font-bold underline text-[11px] block pt-1">
                Kota Legal Aid Portal →
              </button>
            </div>

            <div className="p-4 bg-[#F4F0E6]/30 rounded-xl border border-[#202020]/10 space-y-1.5">
              <span className="font-bold text-[#202020]">Industry & Major Employers</span>
              <p className="text-[#202020]/75">
                Chambal Fertilisers (Gadepan, Kota), DCM Shriram Chemicals, and premier educational enterprise Allen Career Institute.
              </p>
              <button onClick={() => navigate('/companies/ent-chambal-fert/ownership')} className="text-[#F28C28] font-bold underline text-[11px] block pt-1">
                View CFCL Shareholding →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HAQNAAMA Legal Research Fellowship (HLRF) Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-linear-to-r from-[#202020] to-[#2c2c2c] text-[#F4F0E6] rounded-2xl shadow-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F4F0E6]/15 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                Academic Research & Co-Authorship Fellowship
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                HAQNAAMA Legal Research Fellowship (HLRF)
              </h3>
              <p className="text-xs text-[#F4F0E6]/80 max-w-2xl leading-relaxed">
                Connecting experienced legal scholars and advocates with undergraduate law students for structured, semester-long research collaborations and peer-reviewed manuscript co-authorship.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => navigate('/fellowship/apply-student')}
                className="px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Apply as Student
              </button>
              <button
                onClick={() => navigate('/fellowship/apply-mentor')}
                className="px-4 py-2 bg-white text-[#202020] hover:bg-gray-100 text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Apply as Mentor
              </button>
              <button
                onClick={() => navigate('/fellowship')}
                className="px-4 py-2 border border-white/20 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Fellowship Overview →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#F4F0E6]/80">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-white block">1 Mentor + 2–3 Students</span>
              <p className="text-[11px] text-[#F4F0E6]/70">
                Guaranteed high-touch guidance with pre-agreed ethical authorship covenants.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-white block">Evidence-First Methodology</span>
              <p className="text-[11px] text-[#F4F0E6]/70">
                Primary case law synthesis and bare act audits with zero AI citation fabrication.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-white block">Open-Access Repository</span>
              <p className="text-[11px] text-[#F4F0E6]/70">
                Peer-reviewed publication pipeline, public erratum tracking, and verifiable certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preserved Citizen Civic Tools Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase text-[#F28C28] tracking-wider">
              Citizen Empowerment Tools (Stages 01–04)
            </span>
            <h3 className="text-lg font-bold text-[#202020]">
              Need individual legal guidance or document drafting?
            </h3>
            <p className="text-xs text-[#202020]/75 max-w-xl">
              Access the Rights Navigator, Draft Preparation Assistant, or Statutory Legal Aid Finder for personal citizen guidance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/rights-navigator')}
              className="px-4 py-2 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Rights Navigator
            </button>
            <button
              onClick={() => navigate('/complaint-assistant')}
              className="px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              Draft Assistant
            </button>
            <button
              onClick={() => navigate('/my-workspace')}
              className="px-4 py-2 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              My Workspace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
