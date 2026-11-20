import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  EntityRelationship,
  GraphRelationshipType,
  GraphVerificationStatus,
  NationalEntity,
} from '../types';
import {
  Share2,
  Filter,
  Search,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  Table,
  Eye,
  Info,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

interface Props {
  initialEntityId?: string;
}

export const StakeholderGraphPage: React.FC<Props> = ({ initialEntityId }) => {
  const { entities, relationships, navigate } = useApp();

  const [selectedEntityId, setSelectedEntityId] = useState<string>(
    initialEntityId || 'ent-dlsa-kota'
  );
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string>('rel-nalsa-rslsa');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active focal entity
  const activeEntity = useMemo(() => {
    return entities.find((e) => e.entityId === selectedEntityId) || entities[0];
  }, [entities, selectedEntityId]);

  // Filtered relationships
  const filteredRelationships = useMemo(() => {
    return relationships.filter((rel) => {
      const matchType = filterType === 'all' || rel.relationshipType === filterType;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        rel.description.toLowerCase().includes(q) ||
        rel.sourceDocumentReference.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [relationships, filterType, searchQuery]);

  // Active selected relationship details
  const activeRelationship = useMemo(() => {
    return (
      relationships.find((r) => r.relationshipId === selectedRelationshipId) ||
      relationships[0]
    );
  }, [relationships, selectedRelationshipId]);

  const sourceEntity = useMemo(() => {
    return entities.find((e) => e.entityId === activeRelationship?.sourceEntityId);
  }, [entities, activeRelationship]);

  const targetEntity = useMemo(() => {
    return entities.find((e) => e.entityId === activeRelationship?.targetEntityId);
  }, [entities, activeRelationship]);

  // Node positions for interactive SVG graph rendering
  const graphNodes = useMemo(() => {
    // Entities involved in filtered relationships
    const entityIds = new Set<string>();
    filteredRelationships.forEach((r) => {
      entityIds.add(r.sourceEntityId);
      entityIds.add(r.targetEntityId);
    });

    const list = Array.from(entityIds);
    const radius = 220;
    const centerX = 360;
    const centerY = 280;

    return list.map((id, index) => {
      const ent = entities.find((e) => e.entityId === id);
      const angle = (index / list.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return {
        id,
        name: ent ? ent.canonicalName : id,
        type: ent ? ent.entityType : 'unknown',
        x,
        y,
        isSelected: selectedEntityId === id,
      };
    });
  }, [filteredRelationships, entities, selectedEntityId]);

  const getNodeCoordinates = (id: string) => {
    const node = graphNodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 360, y: 280 };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span>Stage 09 Stakeholder Intelligence Graph</span>
          </div>
          <h1 className="text-3xl font-black text-[#202020]">
            Inter-Entity Stakeholder & Governance Graph
          </h1>
          <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
            Multi-relational graph connecting government departments, judiciary, corporate ownership, public services, and regulatory oversight backed by documentary evidence.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#202020]/15 shadow-xs">
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'graph' ? 'bg-[#202020] text-white shadow-xs' : 'text-[#202020]/70 hover:text-[#202020]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Graph</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'table' ? 'bg-[#202020] text-white shadow-xs' : 'text-[#202020]/70 hover:text-[#202020]'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tabular Index</span>
          </button>
        </div>
      </div>

      {/* Ethical Safeguard Banner */}
      <div className="bg-[#202020] text-[#F4F0E6] rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-[#F28C28] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-white mb-0.5">Objective Non-Adversarial Graph Standard:</p>
          <p className="text-[#F4F0E6]/80">
            A graph connection documents a legally verifiable institutional relationship (such as statutory oversight, geographical jurisdiction, or equity holding). Connections do not imply collusion, criminality, or improper influence.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#202020]/15 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#202020]/70 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Relationship Type:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-1.5 bg-[#F4F0E6]/40 border border-[#202020]/20 rounded-md text-xs font-medium text-[#202020]"
          >
            <option value="all">All Documented Relationships</option>
            <option value="government_jurisdiction">Government Jurisdiction / Statutory Oversight</option>
            <option value="legal_jurisdiction">Legal / Appellate Hierarchy</option>
            <option value="official_appointment">Official / Ex-Officio Appointments</option>
            <option value="institutional_affiliation">Institutional Affiliation</option>
            <option value="geographic_presence">Geographic Presence / Plants</option>
            <option value="ownership">Corporate Ownership & Equity</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#202020]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search relationship narrative..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-md text-xs text-[#202020] focus:border-[#F28C28] outline-hidden"
          />
        </div>
      </div>

      {/* Main Graph & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Graph Canvas or Table */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === 'graph' ? (
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-[#202020]/10 pb-3">
                <span className="text-xs font-bold text-[#202020] uppercase">
                  Interactive Node-Link Network ({graphNodes.length} nodes · {filteredRelationships.length} relationships)
                </span>
                <span className="text-[11px] text-[#202020]/60">Click node or edge to inspect</span>
              </div>

              {/* SVG Relationship Graph */}
              <div className="relative w-full aspect-4/3 bg-[#F4F0E6]/40 rounded-xl border border-[#202020]/10 overflow-hidden flex items-center justify-center">
                <svg
                  viewBox="0 0 720 560"
                  className="w-full h-full"
                  aria-label="Stakeholder Network Graph"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="8"
                      markerHeight="6"
                      refX="18"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 8 3, 0 6" fill="#F28C28" />
                    </marker>
                    <marker
                      id="arrowhead-selected"
                      markerWidth="10"
                      markerHeight="8"
                      refX="20"
                      refY="4"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 4, 0 8" fill="#202020" />
                    </marker>
                  </defs>

                  {/* Edges */}
                  {filteredRelationships.map((rel) => {
                    const src = getNodeCoordinates(rel.sourceEntityId);
                    const tgt = getNodeCoordinates(rel.targetEntityId);
                    const isSelected = selectedRelationshipId === rel.relationshipId;

                    return (
                      <g
                        key={rel.relationshipId}
                        onClick={() => setSelectedRelationshipId(rel.relationshipId)}
                        className="cursor-pointer group"
                      >
                        <line
                          x1={src.x}
                          y1={src.y}
                          x2={tgt.x}
                          y2={tgt.y}
                          stroke={isSelected ? '#202020' : '#F28C28'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          strokeDasharray={rel.verificationStatus === 'UNVERIFIED' ? '4 4' : 'none'}
                          markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
                          className="transition-all group-hover:stroke-black group-hover:stroke-[3]"
                        />
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {graphNodes.map((node) => {
                    const isSelected = selectedEntityId === node.id;
                    const isCenter = node.id === 'ent-dlsa-kota' || node.id === 'ent-sci';

                    return (
                      <g
                        key={node.id}
                        onClick={() => {
                          setSelectedEntityId(node.id);
                          const matchingRel = relationships.find(
                            (r) => r.sourceEntityId === node.id || r.targetEntityId === node.id
                          );
                          if (matchingRel) setSelectedRelationshipId(matchingRel.relationshipId);
                        }}
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isSelected ? 22 : 16}
                          fill={isSelected ? '#F28C28' : isCenter ? '#202020' : '#FFFFFF'}
                          stroke={isSelected ? '#202020' : '#F28C28'}
                          strokeWidth={2}
                          className="shadow-sm"
                        />
                        <text
                          x={node.x}
                          y={node.y + 32}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#202020"
                          className="select-none bg-white"
                        >
                          {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          ) : (
            /* Tabular Representation */
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#202020] uppercase">
                Tabular Relationship Registry
              </h2>
              <div className="divide-y divide-[#202020]/10 max-h-[550px] overflow-y-auto text-xs">
                {filteredRelationships.map((rel) => (
                  <button
                    key={rel.relationshipId}
                    onClick={() => setSelectedRelationshipId(rel.relationshipId)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-start justify-between gap-4 ${
                      selectedRelationshipId === rel.relationshipId
                        ? 'bg-[#FDF3E7] font-bold text-[#202020]'
                        : 'hover:bg-[#F4F0E6]/40 text-[#202020]/80'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                        {rel.relationshipType.replace('_', ' ')}
                      </span>
                      <p className="text-xs font-bold text-[#202020] mt-0.5">{rel.description}</p>
                      <p className="text-[10px] text-[#202020]/50 mt-1 font-mono">
                        Ref: {rel.sourceDocumentReference}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-800 rounded shrink-0">
                      {rel.verificationStatus}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Evidence Inspector Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#202020]/10 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
                  Evidence Inspector
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 rounded-sm">
                  {activeRelationship.verificationStatus}
                </span>
              </div>
              <h2 className="text-lg font-black text-[#202020] mt-1">
                {activeRelationship.relationshipType.replace('_', ' ').toUpperCase()}
              </h2>
            </div>

            {/* Bilateral Entities */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F4F0E6]/40 p-4 rounded-xl border border-[#202020]/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#202020]/60">Source Entity</span>
                <p className="font-bold text-[#202020] mt-0.5">
                  {sourceEntity?.canonicalName || activeRelationship.sourceEntityId}
                </p>
                <button
                  onClick={() => sourceEntity && navigate(`/entities/${sourceEntity.entityId}`)}
                  className="text-[10px] text-[#F28C28] font-bold underline mt-1 block"
                >
                  View Profile →
                </button>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#202020]/60">Target Entity</span>
                <p className="font-bold text-[#202020] mt-0.5">
                  {targetEntity?.canonicalName || activeRelationship.targetEntityId}
                </p>
                <button
                  onClick={() => targetEntity && navigate(`/entities/${targetEntity.entityId}`)}
                  className="text-[10px] text-[#F28C28] font-bold underline mt-1 block"
                >
                  View Profile →
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs text-[#202020]">
              <span className="text-[10px] font-bold uppercase text-[#202020]/60">
                Documented Relationship Description
              </span>
              <p className="leading-relaxed bg-white p-3 rounded-lg border border-[#202020]/15">
                {activeRelationship.description}
              </p>
            </div>

            {/* Documentary Evidence Reference */}
            <div className="p-4 bg-[#FDF3E7] rounded-xl border border-[#F28C28]/30 space-y-2 text-xs">
              <span className="font-bold uppercase text-[10px] text-[#202020]/70 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Statutory / Evidentiary Reference</span>
              </span>
              <p className="font-semibold text-[#202020]">
                {activeRelationship.sourceDocumentReference}
              </p>
              <div className="flex justify-between text-[10px] text-[#202020]/60 pt-1 border-t border-[#F28C28]/20">
                <span>Effective Since: {activeRelationship.validFrom}</span>
                <span>Review: {activeRelationship.reviewStatus.toUpperCase()}</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex justify-between items-center text-xs">
              <button
                onClick={() => navigate('/sources')}
                className="text-[#202020] hover:text-[#F28C28] underline font-semibold"
              >
                Inspect Public Data Sources
              </button>
              <button
                onClick={() => navigate(`/corrections?targetType=relationship&targetId=${activeRelationship.relationshipId}&targetName=${encodeURIComponent(activeRelationship.description.slice(0, 40))}`)}
                className="text-[#F28C28] font-bold underline"
              >
                Dispute or Correct →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
