import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PublicDataSource } from '../types';
import {
  Database,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
} from 'lucide-react';

export const PublicSourcesPage: React.FC = () => {
  const { sources, verifySource, activeRole } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState('');

  const filteredSources = sources.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      s.sourceName.toLowerCase().includes(q) ||
      s.publisher.toLowerCase().includes(q) ||
      s.sourceType.toLowerCase().includes(q) ||
      s.geographicCoverage.toLowerCase().includes(q)
    );
  });

  const handleVerify = (sourceId: string, name: string) => {
    const success = verifySource(sourceId);
    if (success) {
      setNotice(`Verification renewed for ${name} by ${activeRole}.`);
      setTimeout(() => setNotice(''), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>Stage 10 Public Data Sources Registry</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          Authoritative Public Data Sources
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Catalog of official Government of India registries, corporate disclosure repositories, and judicial grids powering HAQNAAMA's geographic and stakeholder mapping.
        </p>
      </div>

      {/* Notice */}
      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#202020]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search data sources by name, publisher, or statutory basis..."
            className="w-full pl-9 pr-3 py-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
          />
        </div>
      </div>

      {/* Sources Grid */}
      <div className="space-y-6">
        {filteredSources.map((source: PublicDataSource) => (
          <div
            key={source.sourceId}
            className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  {source.sourceType.replace('_', ' ').toUpperCase()}
                </span>
                <h2 className="text-lg font-bold text-[#202020] mt-0.5">{source.sourceName}</h2>
                <p className="text-xs text-[#202020]/70">
                  Publisher: <strong>{source.publisher}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 rounded-sm flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{source.verificationStatus.toUpperCase()}</span>
                </span>

                {(activeRole === 'ADMINISTRATOR' || activeRole === 'REVIEWER') && (
                  <button
                    onClick={() => handleVerify(source.sourceId, source.sourceName)}
                    className="p-1 px-2.5 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white text-[11px] font-bold rounded-md transition-colors flex items-center gap-1 text-[#202020]"
                    title="Audit and recheck source"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Audit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F4F0E6]/30 p-4 rounded-xl border border-[#202020]/10">
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Access Method</span>
                <p className="font-semibold text-[#202020] capitalize">{source.accessMethod.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">License Reference</span>
                <p className="text-[#202020] truncate">{source.licenseReference}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Geographic Scope</span>
                <p className="text-[#202020] line-clamp-1">{source.geographicCoverage}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#202020]/60 uppercase font-semibold">Last Audited</span>
                <p className="text-emerald-700 font-bold">{source.lastVerifiedAt}</p>
              </div>
            </div>

            {/* Known Limitations */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-950">
              <span className="font-bold text-amber-900">Known Limitations & Update Cycles:</span>
              <p className="text-[11px] leading-relaxed">{source.knownLimitations}</p>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#202020]/60 font-mono">
                Version Ref: {source.sourceVersion} ({source.reportingPeriod})
              </span>
              <a
                href={source.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F28C28] hover:text-[#D9771E]"
              >
                <span>Open Authoritative Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
