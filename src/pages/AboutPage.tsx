import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../services/i18n';
import { ShieldCheck, Scale, MapPin, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { preferences, navigate } = useApp();
  const t = getTranslation(preferences.language);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF3E7] border border-[#F28C28]/30 rounded-md text-xs font-bold text-[#F28C28] mb-3">
          <Heart className="w-3.5 h-3.5" />
          <span>Founding Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#202020]">
          About HAQNAAMA (हक़नामा)
        </h1>
        <p className="text-base text-[#F28C28] font-bold mt-1">
          {t.brand.tagline}
        </p>
      </div>

      <div className="bg-white border border-[#202020]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 leading-relaxed text-sm text-[#202020]/85">
        <div>
          <h2 className="text-lg font-bold text-[#202020] mb-2">Our Vision & Inception</h2>
          <p>
            HAQNAAMA was founded by <strong>Deepak Sharma</strong> as a free, open-access legal empowerment and civic-technology initiative. Initially conceptualized for citizens and students in <strong>Kota, Rajasthan</strong>, HAQNAAMA bridges the deep knowledge gap between ordinary citizens and the Indian legal architecture.
          </p>
          <p className="mt-3">
            In bustling educational and commercial hubs like Kota, thousands of young students, families, workers, and consumers confront complex administrative and legal challenges every day—from sudden cyber fraud and security deposits to consumer grievances, tenancy conflicts, and police station procedures. Most people hesitate to seek remedy because they don't know which law applies or which official portal can assist them.
          </p>
        </div>

        <div className="p-4 bg-[#F4F0E6] rounded-xl border border-[#202020]/15 space-y-2">
          <h3 className="font-bold text-[#202020] text-xs uppercase tracking-wider">
            Our Non-Negotiable Civic Principles:
          </h3>
          <ul className="text-xs space-y-2 list-disc list-inside text-[#202020]/80">
            <li><strong>Truth & Source Provenance:</strong> Every legal statement must directly link to verified statutory repositories (India Code, Supreme Court, or statutory gazettes).</li>
            <li><strong>No Fake Guarantees:</strong> We never predict court outcomes or promise that a complaint will automatically succeed.</li>
            <li><strong>Clear Boundaries:</strong> HAQNAAMA empowers citizens with knowledge and structured document preparation; it does not replace qualified advocates or official courts.</li>
            <li><strong>Privacy First:</strong> Personal narratives and drafts are kept on your own device without unnecessary data extraction.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#202020] mb-2">Non-Commercial Commitment</h2>
          <p>
            HAQNAAMA does not charge citizens for legal information, sell user data, or run paid priority listings for advocates. It remains an open public interest civic asset.
          </p>
        </div>

        <div className="pt-4 border-t border-[#202020]/10 flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/rights-navigator')}
            className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
          >
            Explore Rights Navigator
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-5 py-2.5 bg-white border border-[#202020]/20 hover:bg-black/5 text-[#202020] font-bold text-xs rounded-lg transition-colors"
          >
            Suggest a Correction / Contact
          </button>
        </div>
      </div>
    </div>
  );
};
