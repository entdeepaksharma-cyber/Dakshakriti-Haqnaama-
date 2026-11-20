import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserPreferences,
  Language,
  TextSize,
  ContrastMode,
  ExplanationStyle,
  UserRole,
  AdministrativeUnit,
  NationalEntity,
  EntityOwnershipRecord,
  EntityRelationship,
  PublicDataSource,
  CorrectionReport,
  NavigatorSession,
  PreparedDraft,
  AuditLog,
} from '../types';
import {
  CANONICAL_ADMIN_UNITS,
  CANONICAL_NATIONAL_ENTITIES,
  CANONICAL_OWNERSHIP_RECORDS,
  CANONICAL_RELATIONSHIPS,
  CANONICAL_PUBLIC_SOURCES,
  INITIAL_CORRECTION_REPORTS,
} from '../data/nationalRegistryData';

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  savedEntityIds: string[];
  savedUnitIds: string[];
  createdAt: string;
  notes: string;
}

interface AppContextType {
  // User Preferences & Role
  preferences: UserPreferences;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setTextSize: (size: TextSize) => void;
  setContrastMode: (mode: ContrastMode) => void;
  setReducedMotion: (reduced: boolean) => void;
  setExplanationStyle: (style: ExplanationStyle) => void;
  setAnalyticsConsent: (consent: boolean) => void;

  // Navigation
  currentRoute: string;
  routeQuery: URLSearchParams;
  navigate: (path: string) => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  completeOnboarding: (prefs?: Partial<UserPreferences>) => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;

  // Canonical Datasets
  adminUnits: AdministrativeUnit[];
  entities: NationalEntity[];
  ownershipRecords: EntityOwnershipRecord[];
  relationships: EntityRelationship[];
  sources: PublicDataSource[];
  corrections: CorrectionReport[];

  // Data Mutations (with RBAC enforcement)
  importAdminUnits: (newUnits: AdministrativeUnit[], sourceName: string) => { success: boolean; importedCount: number; errors: string[] };
  importEntities: (newEntities: NationalEntity[], sourceName: string) => { success: boolean; importedCount: number; errors: string[] };
  submitCorrection: (report: Omit<CorrectionReport, 'id' | 'submittedAt' | 'status'>) => string;
  updateCorrectionStatus: (id: string, status: CorrectionReport['status'], notes?: string) => void;
  verifySource: (sourceId: string) => boolean;

  // Research Projects
  researchProjects: ResearchProject[];
  createResearchProject: (title: string, description: string) => string;
  saveEntityToProject: (projectId: string, entityId: string) => void;

  // Preserved Legal Workspace Data
  savedSessions: NavigatorSession[];
  saveSession: (session: NavigatorSession) => void;
  deleteSession: (id: string) => void;
  savedDrafts: PreparedDraft[];
  saveDraft: (draft: PreparedDraft) => void;
  deleteDraft: (id: string) => void;
  clearAllUserData: () => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string, details: string) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'national-stakeholder-user',
  language: 'en',
  text_size: 'standard',
  contrast_mode: 'standard',
  reduced_motion: false,
  explanation_style: 'simple',
  onboarding_completed: true,
  analytics_consent: false,
  updated_at: new Date().toISOString(),
  activeRole: 'ADMINISTRATOR',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const PREFS_STORAGE_KEY = 'haqnaama_nsm_preferences_v2';
const UNITS_STORAGE_KEY = 'haqnaama_nsm_units_v2';
const ENTITIES_STORAGE_KEY = 'haqnaama_nsm_entities_v2';
const CORRECTIONS_STORAGE_KEY = 'haqnaama_nsm_corrections_v2';
const RESEARCH_STORAGE_KEY = 'haqnaama_nsm_research_v2';
const SESSIONS_STORAGE_KEY = 'haqnaama_saved_sessions_v2';
const DRAFTS_STORAGE_KEY = 'haqnaama_saved_drafts_v2';
const AUDIT_STORAGE_KEY = 'haqnaama_audit_logs_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(PREFS_STORAGE_KEY);
      if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    } catch {
      // safe fallback
    }
    return DEFAULT_PREFERENCES;
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    return preferences.activeRole || 'ADMINISTRATOR';
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !preferences.onboarding_completed;
  });

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [routeQuery, setRouteQuery] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  // Canonical datasets
  const [adminUnits, setAdminUnits] = useState<AdministrativeUnit[]>(() => {
    try {
      const stored = localStorage.getItem(UNITS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : CANONICAL_ADMIN_UNITS;
    } catch {
      return CANONICAL_ADMIN_UNITS;
    }
  });

  const [entities, setEntities] = useState<NationalEntity[]>(() => {
    try {
      const stored = localStorage.getItem(ENTITIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : CANONICAL_NATIONAL_ENTITIES;
    } catch {
      return CANONICAL_NATIONAL_ENTITIES;
    }
  });

  const [ownershipRecords] = useState<EntityOwnershipRecord[]>(CANONICAL_OWNERSHIP_RECORDS);
  const [relationships] = useState<EntityRelationship[]>(CANONICAL_RELATIONSHIPS);
  const [sources, setSources] = useState<PublicDataSource[]>(CANONICAL_PUBLIC_SOURCES);

  const [corrections, setCorrections] = useState<CorrectionReport[]>(() => {
    try {
      const stored = localStorage.getItem(CORRECTIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_CORRECTION_REPORTS;
    } catch {
      return INITIAL_CORRECTION_REPORTS;
    }
  });

  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(() => {
    try {
      const stored = localStorage.getItem(RESEARCH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'proj-kota-governance',
          title: 'Kota Municipal & Legal Aid Coordination Dossier',
          description: 'Documenting institutional links between DLSA Kota, District Court, and Municipal Corporations.',
          savedEntityIds: ['ent-dlsa-kota', 'ent-court-kota', 'ent-nn-north', 'ent-collector-kota'],
          savedUnitIds: ['dist-kota', 'subdist-ladpura', 'ulb-kota-north'],
          createdAt: new Date().toISOString(),
          notes: 'Source-backed analysis of local statutory service delivery.',
        }
      ];
    } catch {
      return [];
    }
  });

  // Preserved legal sessions & drafts
  const [savedSessions, setSavedSessions] = useState<NavigatorSession[]>(() => {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedDrafts, setSavedDrafts] = useState<PreparedDraft[]>(() => {
    try {
      const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        {
          id: 'log-canonical-init',
          timestamp: new Date().toISOString(),
          actor: 'System (LGD/MCA21)',
          action: 'REGISTRY_INITIALIZED',
          target: 'National Stakeholder Infrastructure',
          details: 'Canonical administrative geography and verified entity registry initialized.',
        }
      ];
    } catch {
      return [];
    }
  });

  // Popstate router sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
      setRouteQuery(new URLSearchParams(window.location.search));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    try {
      const url = new URL(path, window.location.origin);
      if (window.location.pathname !== url.pathname || window.location.search !== url.search) {
        window.history.pushState({}, '', path);
      }
      setCurrentRoute(url.pathname);
      setRouteQuery(new URLSearchParams(url.search));
      window.scrollTo({ top: 0, behavior: preferences.reduced_motion ? 'auto' : 'smooth' });
    } catch {
      window.history.pushState({}, '', path);
      setCurrentRoute(path);
      setRouteQuery(new URLSearchParams());
      window.scrollTo(0, 0);
    }
  };

  // Sync HTML attributes & localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ ...preferences, activeRole }));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.setAttribute('lang', preferences.language);
    root.setAttribute('data-text-size', preferences.text_size);
    root.setAttribute('data-contrast', preferences.contrast_mode);
    root.setAttribute('data-reduced-motion', String(preferences.reduced_motion));
  }, [preferences, activeRole]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    updatePreferences({ activeRole: role });
    addAuditLog('ROLE_SWITCH', 'Auth Context', `Active session switched to ${role}`);
  };

  const setLanguage = (language: Language) => updatePreferences({ language });
  const setTextSize = (text_size: TextSize) => updatePreferences({ text_size });
  const setContrastMode = (contrast_mode: ContrastMode) => updatePreferences({ contrast_mode });
  const setReducedMotion = (reduced_motion: boolean) => updatePreferences({ reduced_motion });
  const setExplanationStyle = (explanation_style: ExplanationStyle) => updatePreferences({ explanation_style });
  const setAnalyticsConsent = (analytics_consent: boolean) => updatePreferences({ analytics_consent });

  const completeOnboarding = (prefs?: Partial<UserPreferences>) => {
    updatePreferences({ ...prefs, onboarding_completed: true });
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    updatePreferences({ onboarding_completed: true });
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    updatePreferences({ onboarding_completed: false });
    setShowOnboarding(true);
  };

  // RBAC protected data import
  const importAdminUnits = (newUnits: AdministrativeUnit[], sourceName: string) => {
    if (activeRole !== 'ADMINISTRATOR' && activeRole !== 'DATA_IMPORTER') {
      return { success: false, importedCount: 0, errors: ['Unauthorized: Only ADMINISTRATOR or DATA_IMPORTER can import administrative units.'] };
    }

    const errors: string[] = [];
    const validUnits: AdministrativeUnit[] = [];

    newUnits.forEach((u, i) => {
      if (!u.id || !u.officialName || !u.officialCode) {
        errors.push(`Row ${i + 1}: Missing mandatory id, officialName, or officialCode.`);
      } else {
        validUnits.push(u);
      }
    });

    if (validUnits.length > 0) {
      setAdminUnits((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const merged = [...prev, ...validUnits.filter((u) => !existingIds.has(u.id))];
        try {
          localStorage.setItem(UNITS_STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      });

      addAuditLog('DATA_IMPORT_UNITS', sourceName, `Successfully imported ${validUnits.length} units from ${sourceName}`);
    }

    return { success: validUnits.length > 0, importedCount: validUnits.length, errors };
  };

  const importEntities = (newEntities: NationalEntity[], sourceName: string) => {
    if (activeRole !== 'ADMINISTRATOR' && activeRole !== 'DATA_IMPORTER') {
      return { success: false, importedCount: 0, errors: ['Unauthorized: Only ADMINISTRATOR or DATA_IMPORTER can import entities.'] };
    }

    const errors: string[] = [];
    const validEntities: NationalEntity[] = [];

    newEntities.forEach((e, i) => {
      if (!e.entityId || !e.canonicalName || !e.legalForm) {
        errors.push(`Row ${i + 1}: Missing entityId, canonicalName, or legalForm.`);
      } else {
        validEntities.push(e);
      }
    });

    if (validEntities.length > 0) {
      setEntities((prev) => {
        const existingIds = new Set(prev.map((p) => p.entityId));
        const merged = [...prev, ...validEntities.filter((e) => !existingIds.has(e.entityId))];
        try {
          localStorage.setItem(ENTITIES_STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      });

      addAuditLog('DATA_IMPORT_ENTITIES', sourceName, `Imported ${validEntities.length} entities from ${sourceName}`);
    }

    return { success: validEntities.length > 0, importedCount: validEntities.length, errors };
  };

  // Correction submission & triage
  const submitCorrection = (reportData: Omit<CorrectionReport, 'id' | 'submittedAt' | 'status'>) => {
    const id = `corr-${Date.now()}`;
    const newReport: CorrectionReport = {
      ...reportData,
      id,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };

    setCorrections((prev) => {
      const updated = [newReport, ...prev];
      try {
        localStorage.setItem(CORRECTIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    addAuditLog('CORRECTION_SUBMITTED', reportData.targetName, `Issue reported: ${reportData.issueType}`);
    return id;
  };

  const updateCorrectionStatus = (id: string, status: CorrectionReport['status'], notes?: string) => {
    if (activeRole !== 'ADMINISTRATOR' && activeRole !== 'REVIEWER') {
      alert('Permission Denied: Only Administrator or Reviewer can update dispute resolution status.');
      return;
    }

    setCorrections((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              reviewerNotes: notes || c.reviewerNotes,
              resolvedAt: status === 'RESOLVED' || status === 'REJECTED' ? new Date().toISOString() : c.resolvedAt,
            }
          : c
      );
      try {
        localStorage.setItem(CORRECTIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    addAuditLog('CORRECTION_STATUS_UPDATED', id, `Status transitioned to ${status}`);
  };

  const verifySource = (sourceId: string) => {
    if (activeRole !== 'ADMINISTRATOR' && activeRole !== 'REVIEWER') {
      alert('Permission Denied: Only Administrator or Reviewer can certify source verification.');
      return false;
    }

    setSources((prev) =>
      prev.map((s) =>
        s.sourceId === sourceId
          ? { ...s, lastVerifiedAt: new Date().toISOString().split('T')[0], verificationStatus: 'verified' }
          : s
      )
    );
    addAuditLog('SOURCE_VERIFIED', sourceId, `Verification renewed by ${activeRole}`);
    return true;
  };

  // Research Projects
  const createResearchProject = (title: string, description: string) => {
    const id = `proj-${Date.now()}`;
    const newProj: ResearchProject = {
      id,
      title,
      description,
      savedEntityIds: [],
      savedUnitIds: [],
      createdAt: new Date().toISOString(),
      notes: '',
    };
    setResearchProjects((prev) => {
      const updated = [newProj, ...prev];
      try {
        localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addAuditLog('RESEARCH_PROJECT_CREATED', title, 'New research workspace initiated.');
    return id;
  };

  const saveEntityToProject = (projectId: string, entityId: string) => {
    setResearchProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === projectId && !p.savedEntityIds.includes(entityId)) {
          return { ...p, savedEntityIds: [...p.savedEntityIds, entityId] };
        }
        return p;
      });
      try {
        localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addAuditLog('ENTITY_PINNED_TO_PROJECT', entityId, `Pinned to project ${projectId}`);
  };

  // Preserved session management
  const saveSession = (session: NavigatorSession) => {
    setSavedSessions((prev) => {
      const updated = [session, ...prev.filter((s) => s.id !== session.id)];
      try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addAuditLog('SAVE_SESSION', session.id, `Rights Navigator session for ${session.category} saved.`);
  };

  const deleteSession = (id: string) => {
    setSavedSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addAuditLog('DELETE_SESSION', id, 'Navigator session deleted.');
  };

  const saveDraft = (draft: PreparedDraft) => {
    setSavedDrafts((prev) => {
      const updated = [draft, ...prev.filter((d) => d.id !== draft.id)];
      try {
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addAuditLog('SAVE_DRAFT', draft.id, `Legal draft ${draft.title} saved.`);
  };

  const deleteDraft = (id: string) => {
    setSavedDrafts((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    addAuditLog('DELETE_DRAFT', id, 'Prepared draft deleted.');
  };

  const clearAllUserData = () => {
    setSavedSessions([]);
    setSavedDrafts([]);
    setResearchProjects([]);
    try {
      localStorage.removeItem(SESSIONS_STORAGE_KEY);
      localStorage.removeItem(DRAFTS_STORAGE_KEY);
      localStorage.removeItem(RESEARCH_STORAGE_KEY);
    } catch {
      // ignore
    }
    addAuditLog('CLEAR_ALL_DATA', 'LOCAL_STORAGE', 'All local workspace and session data cleared.');
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actor: activeRole,
      action,
      target,
      details,
    };
    setAuditLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 99)];
      try {
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        activeRole,
        setActiveRole,
        setLanguage,
        setTextSize,
        setContrastMode,
        setReducedMotion,
        setExplanationStyle,
        setAnalyticsConsent,
        currentRoute,
        routeQuery,
        navigate,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
        skipOnboarding,
        resetOnboarding,
        adminUnits,
        entities,
        ownershipRecords,
        relationships,
        sources,
        corrections,
        importAdminUnits,
        importEntities,
        submitCorrection,
        updateCorrectionStatus,
        verifySource,
        researchProjects,
        createResearchProject,
        saveEntityToProject,
        savedSessions,
        saveSession,
        deleteSession,
        savedDrafts,
        saveDraft,
        deleteDraft,
        clearAllUserData,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
