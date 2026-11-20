import React from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { currentRoute, navigate } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-[#FDF3E7] border-2 border-[#F28C28] rounded-2xl flex items-center justify-center mx-auto text-[#F28C28]">
        <HelpCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#202020]">
          Page Not Found
        </h1>
        <p className="text-xs font-mono text-[#202020]/60 bg-[#202020]/5 px-3 py-1 rounded-md inline-block">
          {currentRoute}
        </p>
        <p className="text-sm text-[#202020]/75 max-w-md mx-auto leading-relaxed">
          The requested address does not correspond to an approved HAQNAAMA module or verified legal resource.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#202020] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home Dashboard</span>
        </button>

        <button
          onClick={() => navigate('/rights-navigator')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F28C28] hover:bg-[#D9771E] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
        >
          <Search className="w-4 h-4" />
          <span>Explore Rights Navigator</span>
        </button>
      </div>
    </div>
  );
};
