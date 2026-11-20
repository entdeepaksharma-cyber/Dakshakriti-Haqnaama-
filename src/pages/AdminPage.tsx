import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, AdministrativeUnit, NationalEntity } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  UserCheck,
  Layers,
  Database,
  Building2,
  FileCheck2,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    adminUnits,
    entities,
    importAdminUnits,
    importEntities,
    auditLogs,
    sources,
    verifySource,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'import' | 'sources' | 'rbac' | 'audit'>('import');
  const [importType, setImportType] = useState<'units' | 'entities'>('units');
  const [selectedSource, setSelectedSource] = useState<string>('source-lgd');
  const [rawJsonInput, setRawJsonInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    importedCount: number;
    errors: string[];
  } | null>(null);

  const sampleUnitJson = JSON.stringify(
    [
      {
        id: 'dist-bundi',
        officialName: 'District Bundi',
        localName: 'बूंदी ज़िला',
        unitType: 'district',
        parentUnitId: 'unit-state-rj',
        officialCode: '96',
        codeSystem: 'LGD',
        jurisdictionId: 'rj-bundi',
        validFrom: '1949-03-30',
        administrativeStatus: 'active',
        centroidLatitude: 25.44,
        centroidLongitude: 75.64,
        sourceRecordId: 'source-lgd',
        sourceVersion: 'LGD-2026.03',
        retrievedAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString().split('T')[0],
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    null,
    2
  );

  const handleRunImport = (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus(null);

    if (!rawJsonInput.trim()) {
      setImportStatus({
        success: false,
        importedCount: 0,
        errors: ['Please paste valid JSON records to import.'],
      });
      return;
    }

    try {
      const parsed = JSON.parse(rawJsonInput);
      if (!Array.isArray(parsed)) {
        setImportStatus({
          success: false,
          importedCount: 0,
          errors: ['Root element must be a JSON array of records.'],
        });
        return;
      }

      if (importType === 'units') {
        const res = importAdminUnits(parsed as AdministrativeUnit[], selectedSource);
        setImportStatus(res);
      } else {
        const res = importEntities(parsed as NationalEntity[], selectedSource);
        setImportStatus(res);
      }
    } catch (err: any) {
      setImportStatus({
        success: false,
        importedCount: 0,
        errors: [`JSON Parse Error: ${err.message}`],
      });
    }
  };

  const loadSample = () => {
    setRawJsonInput(sampleUnitJson);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Stage 05, 13 & 15 Administration Console</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          National Stakeholder Mapping Administration
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 max-w-2xl leading-relaxed">
          Manage canonical datasets, execute validated data ingestion from Local Government Directory and MCA21, enforce role permissions, and review audit trails.
        </p>
      </div>

      {/* Role Switcher & RBAC Context */}
      <div className="bg-[#202020] text-[#F4F0E6] rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F28C28] uppercase">
            <UserCheck className="w-4 h-4" />
            <span>Active Session Authorization Level</span>
          </div>
          <span className="text-[11px] font-mono text-[#F4F0E6]/60">
            Current Role: <strong className="text-white">{activeRole}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              'PUBLIC_USER',
              'REGISTERED_USER',
              'RESEARCHER',
              'DATA_IMPORTER',
              'REVIEWER',
              'ADMINISTRATOR',
            ] as UserRole[]
          ).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === role
                  ? 'bg-[#F28C28] text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-[#F4F0E6]/80'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-[#F4F0E6]/70 border-t border-white/10 pt-3 flex flex-wrap gap-4">
          <span><strong>DATA_IMPORTER / ADMIN:</strong> Permitted to import validated units & entities</span>
          <span><strong>REVIEWER / ADMIN:</strong> Permitted to approve disputes & certify sources</span>
          <span><strong>RESEARCHER:</strong> Read public & save private research dossiers</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#202020]/15 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('import')}
          className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'import' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Data Ingestion & Import Engine</span>
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'sources' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Source Health ({sources.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rbac')}
          className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'rbac' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBAC Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-[#202020] text-white' : 'text-[#202020]/70 hover:bg-black/5'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: DATA INGESTION */}
      {activeTab === 'import' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202020]/10 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#F28C28]">
                LGD & MCA Ingestion Pipeline
              </span>
              <h2 className="text-lg font-bold text-[#202020]">
                Validated Administrative & Entity Data Import
              </h2>
            </div>
            <button
              onClick={loadSample}
              className="text-xs font-bold text-[#F28C28] hover:underline"
            >
              Load Sample Bundi District JSON
            </button>
          </div>

          <form onSubmit={handleRunImport} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Target Dataset
                </label>
                <select
                  value={importType}
                  onChange={(e) => setImportType(e.target.value as 'units' | 'entities')}
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg font-medium"
                >
                  <option value="units">Administrative Geography Units (LGD)</option>
                  <option value="entities">National Entities & Establishments (MCA/Courts)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                  Attributed Data Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full p-2.5 bg-[#F4F0E6]/30 border border-[#202020]/20 rounded-lg font-medium"
                >
                  {sources.map((s) => (
                    <option key={s.sourceId} value={s.sourceId}>
                      {s.sourceName} ({s.sourceVersion})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-[#202020]/80 mb-1">
                JSON Data Payload (Array of Canonical Objects)
              </label>
              <textarea
                rows={10}
                required
                value={rawJsonInput}
                onChange={(e) => setRawJsonInput(e.target.value)}
                placeholder="Paste JSON array matching AdministrativeUnit or NationalEntity schema..."
                className="w-full p-3 bg-[#F4F0E6]/25 border border-[#202020]/20 rounded-xl font-mono text-xs text-[#202020] outline-hidden focus:border-[#F28C28]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#202020]/60">
                Current Records: {adminUnits.length} Units · {entities.length} Entities
              </span>

              <button
                type="submit"
                disabled={activeRole !== 'ADMINISTRATOR' && activeRole !== 'DATA_IMPORTER'}
                className="px-6 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Validate & Ingest Dataset</span>
              </button>
            </div>
          </form>

          {/* Import Result Notification */}
          {importStatus && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-1 ${
                importStatus.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {importStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                <span>
                  {importStatus.success
                    ? `Imported ${importStatus.importedCount} records successfully.`
                    : 'Import Failed / Validation Errors Detected'}
                </span>
              </div>
              {importStatus.errors.length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 pt-1 text-[11px]">
                  {importStatus.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#202020] uppercase">
            Data Source Verification Management
          </h2>
          <div className="divide-y divide-[#202020]/10 text-xs">
            {sources.map((s) => (
              <div key={s.sourceId} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-[#202020]">{s.sourceName}</p>
                  <p className="text-[11px] text-[#202020]/60">{s.publisher} · {s.officialUrl}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 rounded">
                    {s.verificationStatus.toUpperCase()}
                  </span>
                  <button
                    onClick={() => verifySource(s.sourceId)}
                    className="px-2.5 py-1 bg-[#F4F0E6] hover:bg-[#F28C28] hover:text-white rounded text-[11px] font-bold transition-colors"
                  >
                    Re-Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[#202020] uppercase">
            Role-Based Access Control (RBAC) Specification
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F4F0E6] uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Role</th>
                  <th className="p-3">Read Public Records</th>
                  <th className="p-3">Save Research Dossier</th>
                  <th className="p-3">Ingest Data (LGD/MCA)</th>
                  <th className="p-3">Resolve Disputes</th>
                  <th className="p-3">System Administration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]/10">
                <tr>
                  <td className="p-3 font-bold">PUBLIC_USER</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">REGISTERED_USER</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">RESEARCHER</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">DATA_IMPORTER</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-red-600">✗ No</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">REVIEWER</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-red-600">✗ No</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-red-600">✗ No</td>
                </tr>
                <tr className="bg-[#FDF3E7]/40">
                  <td className="p-3 font-bold text-[#F28C28]">ADMINISTRATOR</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                  <td className="p-3 text-emerald-700 font-bold">✓ Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-[#202020] uppercase">
            Immutable Audit Log
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#F4F0E6]/30 border border-[#202020]/10 rounded-lg text-xs space-y-0.5">
                <div className="flex justify-between font-mono text-[10px] text-[#202020]/60">
                  <span>{log.timestamp}</span>
                  <span className="font-bold text-[#F28C28]">{log.action}</span>
                </div>
                <p className="font-semibold text-[#202020]">Target: {log.target} · Actor: {log.actor}</p>
                <p className="text-[#202020]/75">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
