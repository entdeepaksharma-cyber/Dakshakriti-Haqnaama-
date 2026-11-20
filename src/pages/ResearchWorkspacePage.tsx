import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookmarkPlus,
  FolderLock,
  Plus,
  Download,
  Trash2,
  Building2,
  Layers,
  ChevronRight,
  ExternalLink,
  Share2,
} from 'lucide-react';

export const ResearchWorkspacePage: React.FC = () => {
  const { researchProjects, createResearchProject, entities, adminUnits, navigate } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    researchProjects[0]?.id || ''
  );

  const activeProject = researchProjects.find((p) => p.id === selectedProjectId) || researchProjects[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const id = createResearchProject(newTitle.trim(), newDesc.trim());
    setSelectedProjectId(id);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  const exportProjectJson = () => {
    if (!activeProject) return;
    const pinnedEntities = entities.filter((e) => activeProject.savedEntityIds.includes(e.entityId));
    const pinnedUnits = adminUnits.filter((u) => activeProject.savedUnitIds.includes(u.id));

    const exportData = {
      project: activeProject,
      entities: pinnedEntities,
      administrativeUnits: pinnedUnits,
      exportedAt: new Date().toISOString(),
      platform: 'HAQNAAMA National Stakeholder Mapping',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haqnaama_research_${activeProject.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
            <FolderLock className="w-3.5 h-3.5" />
            <span>Research & Investigation Workspace</span>
          </div>
          <h1 className="text-3xl font-black text-[#202020]">
            Entity & Geographic Research Projects
          </h1>
          <p className="text-sm text-[#202020]/75 mt-1 max-w-xl leading-relaxed">
            Organize institutional dossiers, pin corporate shareholding patterns, and prepare evidence-backed stakeholder intelligence reports.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Project Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold border-b border-[#202020]/15">
        {researchProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`py-2 px-4 rounded-lg whitespace-nowrap transition-colors ${
              (activeProject && activeProject.id === p.id)
                ? 'bg-[#202020] text-white'
                : 'text-[#202020]/70 hover:bg-black/5'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {activeProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Project Dossier */}
          <div className="lg:col-span-8 bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#202020]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                  Research Dossier ID: {activeProject.id}
                </span>
                <h2 className="text-xl font-bold text-[#202020] mt-1">{activeProject.title}</h2>
                <p className="text-xs text-[#202020]/70 mt-1">{activeProject.description}</p>
              </div>

              <button
                onClick={exportProjectJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F4F0E6] hover:bg-black/10 text-[#202020] font-bold text-xs rounded-lg transition-colors border border-[#202020]/15 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Export Dossier (JSON)</span>
              </button>
            </div>

            {/* Pinned Entities in Dossier */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-[#202020]/80 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Pinned Institutional & Corporate Entities ({activeProject.savedEntityIds.length})</span>
              </h3>

              {activeProject.savedEntityIds.length === 0 ? (
                <p className="text-xs text-[#202020]/60 p-4 bg-[#F4F0E6]/30 rounded-xl">
                  No entities pinned yet. Browse the Entity Registry and click "Save to Dossier".
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entities
                    .filter((e) => activeProject.savedEntityIds.includes(e.entityId))
                    .map((ent) => (
                      <div
                        key={ent.entityId}
                        className="p-3 bg-[#F4F0E6]/40 border border-[#202020]/10 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[9px] font-bold uppercase text-[#F28C28]">
                            {ent.entityType.replace('_', ' ')}
                          </span>
                          <h4 className="text-xs font-bold text-[#202020] line-clamp-1">{ent.canonicalName}</h4>
                          <p className="text-[10px] text-[#202020]/60 mt-0.5">{ent.headquartersLocation.city}, {ent.headquartersLocation.state}</p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-[#202020]/10 flex justify-between items-center text-[11px]">
                          <button
                            onClick={() => navigate(`/entities/${ent.entityId}`)}
                            className="text-[#F28C28] font-bold hover:underline"
                          >
                            Inspect Profile →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Pinned Geographic Units */}
            <div className="space-y-3 pt-4 border-t border-[#202020]/10">
              <h3 className="text-xs font-bold uppercase text-[#202020]/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>Associated Administrative Units</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {adminUnits
                  .filter((u) => activeProject.savedUnitIds.includes(u.id))
                  .map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => navigate('/geography')}
                      className="px-3 py-1.5 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white rounded-lg text-xs font-semibold text-[#202020] transition-colors"
                    >
                      {unit.officialName} ({unit.unitType})
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Fast Navigation & Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-[#202020] uppercase">
                Add More Records to Dossier
              </h3>
              <p className="text-[#202020]/75 leading-relaxed">
                Explore the national registry and pin verified entities or geographic levels:
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => navigate('/entities')}
                  className="w-full py-2 px-3 bg-[#F4F0E6] hover:bg-black/10 rounded-lg font-bold text-left flex items-center justify-between"
                >
                  <span>Browse Entity Registry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/companies')}
                  className="w-full py-2 px-3 bg-[#F4F0E6] hover:bg-black/10 rounded-lg font-bold text-left flex items-center justify-between"
                >
                  <span>Corporate Ownership Registry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/stakeholders')}
                  className="w-full py-2 px-3 bg-[#F4F0E6] hover:bg-black/10 rounded-lg font-bold text-left flex items-center justify-between"
                >
                  <span>Stakeholder Graph</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal: Create Research Project */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#202020] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#202020]">Create New Research Project</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#202020] mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rajasthan Power Sector & Coal Linkages"
                  className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#202020] mb-1">Research Scope</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly state the research objectives and question..."
                  className="w-full p-2 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg outline-hidden focus:border-[#F28C28]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 bg-[#F4F0E6] rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#F28C28] text-white font-bold rounded-md hover:bg-[#D9771E]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
