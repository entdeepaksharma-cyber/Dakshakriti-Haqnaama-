import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import {
  FolderLock,
  Trash2,
  Copy,
  Download,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export const MyWorkspacePage: React.FC = () => {
  const {
    preferences,
    navigate,
    savedSessions,
    deleteSession,
    savedDrafts,
    deleteDraft,
    clearAllUserData,
  } = useApp();
  const t = getTranslation(preferences.language);

  const [activeTab, setActiveTab] = useState<'sessions' | 'drafts'>('sessions');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleExportAll = () => {
    const backup = {
      exported_at: new Date().toISOString(),
      sessions: savedSessions,
      drafts: savedDrafts,
      note: 'HAQNAAMA local workspace export. Does not constitute official court filing.',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haqnaama_workspace_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title & Privacy Badge */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
            <FolderLock className="w-3.5 h-3.5" />
            <span>Local & Private Browser Storage</span>
          </div>
          <h1 className="text-3xl font-black text-[#202020]">
            {t.nav.my_workspace}
          </h1>
          <p className="text-sm text-[#202020]/75 mt-1 max-w-xl">
            {preferences.language === 'en'
              ? 'Your saved Rights Navigator sessions, checklists, and document drafts are stored strictly on this device.'
              : 'आपके द्वारा सहेजी गई चेकलिस्ट, अधिकार सत्र और तैयार प्रारूप केवल आपके इस ब्राउज़र में सुरक्षित हैं।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(savedSessions.length > 0 || savedDrafts.length > 0) && (
            <>
              <button
                onClick={handleExportAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#202020]/20 hover:border-[#F28C28] text-xs font-bold text-[#202020] rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-xs font-bold text-red-700 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing */}
      {showClearConfirm && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-950 space-y-1">
              <p className="font-bold">Permanently delete all workspace records?</p>
              <p>This will erase all saved checklists, navigator sessions, and drafted documents from your local browser storage.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearAllUserData();
                setShowClearConfirm(false);
              }}
              className="px-3 py-1.5 bg-red-700 text-white font-bold text-xs rounded-md hover:bg-red-800"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 bg-white border border-red-300 text-xs font-semibold rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#202020]/15 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'sessions'
              ? 'bg-[#202020] text-white'
              : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Saved Navigator Sessions ({savedSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`py-2 px-4 rounded-lg transition-colors ${
            activeTab === 'drafts'
              ? 'bg-[#202020] text-white'
              : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          Prepared Drafts ({savedDrafts.length})
        </button>
      </div>

      {/* TAB 1: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {savedSessions.length === 0 ? (
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-12 text-center space-y-4">
              <FolderLock className="w-10 h-10 text-[#202020]/30 mx-auto" />
              <p className="text-sm font-bold text-[#202020]">No saved navigator sessions yet.</p>
              <p className="text-xs text-[#202020]/70 max-w-sm mx-auto">
                Use the Rights Navigator to analyze your situation, match statutory protections, and save your action checklist here.
              </p>
              <button
                onClick={() => navigate('/rights-navigator')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F28C28] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Start Rights Navigator</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28] bg-[#FDF3E7] px-2 py-0.5 rounded-xs">
                          {session.category.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[#202020]/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(session.created_at).toLocaleString()}</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#202020] mt-1.5 line-clamp-1">
                        {session.raw_problem_description || 'Inquiry without narrative'}
                      </h3>
                    </div>

                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-1.5 text-[#202020]/40 hover:text-red-600 rounded-md transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Checklist Summary */}
                  <div className="space-y-1.5 pt-2 border-t border-[#202020]/10">
                    <p className="text-xs font-bold text-[#202020]">Action Checklist Items:</p>
                    <ul className="text-xs text-[#202020]/80 space-y-1 list-disc list-inside">
                      {session.next_step_checklist.map((item) => (
                        <li key={item.id} className="line-clamp-1">
                          {item.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Linked Resources */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#202020]/10 text-xs">
                    <span className="text-[#202020]/60 font-semibold">Matched Gateways:</span>
                    {session.recommended_resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F28C28] hover:underline"
                      >
                        <span>{res.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DRAFTS */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          {savedDrafts.length === 0 ? (
            <div className="bg-white border border-[#202020]/15 rounded-2xl p-12 text-center space-y-4">
              <FileText className="w-10 h-10 text-[#202020]/30 mx-auto" />
              <p className="text-sm font-bold text-[#202020]">No prepared drafts yet.</p>
              <p className="text-xs text-[#202020]/70 max-w-sm mx-auto">
                Use the Draft Assistant to assemble consumer representations, cyber fraud intimation notices, or RTI applications.
              </p>
              <button
                onClick={() => navigate('/complaint-assistant')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F28C28] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Open Draft Assistant</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28] bg-[#FDF3E7] px-2 py-0.5 rounded-xs">
                        {draft.template_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-[#202020] mt-1">
                        To: {draft.recipient_authority}
                      </h3>
                      <p className="text-[11px] text-[#202020]/50">
                        Saved: {new Date(draft.updated_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(draft.draft_text);
                          alert('Draft text copied to clipboard.');
                        }}
                        className="p-1.5 text-xs text-[#202020] bg-[#F4F0E6] hover:bg-black/10 rounded-md"
                        title="Copy text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDraft(draft.id)}
                        className="p-1.5 text-[#202020]/40 hover:text-red-600 rounded-md transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <pre className="p-3 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-lg font-mono text-[11px] text-[#202020] max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {draft.draft_text}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
