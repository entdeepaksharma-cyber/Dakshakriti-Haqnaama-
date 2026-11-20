import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  ShieldCheck,
  Scale,
  Database,
  Layers,
  Share2,
  AlertTriangle,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Research Standards & Governance</span>
        </div>
        <h1 className="text-3xl font-black text-[#202020]">
          HAQNAAMA Intelligence & Mapping Methodology
        </h1>
        <p className="text-sm text-[#202020]/75 mt-1 leading-relaxed">
          Operational principles, verification workflows, and evidentiary standards governing national geographic and institutional mapping.
        </p>
      </div>

      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-[#202020]/80 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#F28C28]" />
            <span>1. Administrative Geography & Local Government Directory</span>
          </h2>
          <p>
            India's administrative architecture differs significantly between states. In Rajasthan, subdistrict units are designated as <strong>Tehsils</strong>; in Karnataka, as <strong>Taluks</strong>; in Andhra Pradesh and Telangana, as <strong>Mandals</strong>. HAQNAAMA respects state-specific official nomenclature and does not force diverse jurisdictions into a single artificial schema.
          </p>
          <p>
            Official identifiers (e.g. LGD Codes and Census codes) serve as primary keys. Names alone are never treated as unique identifiers to avoid incorrect mergers of identically named administrative units.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#F28C28]" />
            <span>2. Corporate Ownership & Anti-Hallucination Discipline</span>
          </h2>
          <p>
            Shareholding percentages and promoter disclosures are populated <strong>strictly</strong> from statutory annual returns (MCA Form MGT-7) or SEBI Regulation 31 exchange filings.
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>AI models are strictly forbidden from generating or estimating undisclosed equity stakes.</li>
            <li>Board directorship is never conflated with equity ownership.</li>
            <li>Historical shareholding patterns are never presented as current without recorded verification timestamps.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#F28C28]" />
            <span>3. Stakeholder Graph Relationships</span>
          </h2>
          <p>
            Every edge in the HAQNAAMA stakeholder network graph represents an objectively documented institutional or legal connection (such as statutory appellate hierarchy, gazetted administrative jurisdiction, or corporate parentage).
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 font-medium">
            A graph connection is not evidence of wrongdoing or misconduct. We strictly reject the inference of collusion, criminality, or improper influence from network proximity.
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#F28C28]" />
            <span>4. Data Ingestion & Correction Auditing</span>
          </h2>
          <p>
            Data imports from permitted government portals require schema validation, duplicate detection, and explicit administrative approval. Citizen and researcher corrections pass through an immutable state machine (<code>SUBMITTED → TRIAGED → UNDER_REVIEW → RESOLVED</code>).
          </p>
        </section>

        <div className="pt-4 border-t border-[#202020]/10 flex gap-4">
          <button
            onClick={() => navigate('/coverage')}
            className="px-4 py-2 bg-[#202020] text-white text-xs font-bold rounded-lg hover:bg-black"
          >
            Inspect Live Data Quality Metrics
          </button>
          <button
            onClick={() => navigate('/corrections')}
            className="px-4 py-2 bg-white border border-[#202020]/20 text-xs font-bold text-[#202020] rounded-lg hover:bg-black/5"
          >
            Visit Correction Centre
          </button>
        </div>
      </div>
    </div>
  );
};
