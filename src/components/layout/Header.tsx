import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useFellowship } from '../../context/FellowshipContext';
import { getTranslation } from '../../services/i18n';
import {
  Menu,
  X,
  Globe,
  Settings as SettingsIcon,
  Search,
  MapPin,
  Share2,
  Building2,
  Layers,
  BarChart3,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { preferences, setLanguage, currentRoute, navigate, activeRole, setActiveRole } = useApp();
  const fellowship = useFellowship();
  const t = getTranslation(preferences.language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setRoleMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { path: '/fellowship', label: 'Fellowship (HLRF)', isSpecial: true },
    { path: '/india-map', label: 'India Map' },
    { path: '/geography', label: 'Geography' },
    { path: '/entities', label: 'Entities' },
    { path: '/companies', label: 'Ownership' },
    { path: '/stakeholders', label: 'Stakeholders' },
    { path: '/search', label: 'Search' },
    { path: '/research', label: 'Research' },
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang = preferences.language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F4F0E6]/95 backdrop-blur-md border-b border-[#202020]/10 transition-colors">
      {/* Top Banner: Role Badge & Quick Switch */}
      <div className="bg-[#202020] text-[#F4F0E6] text-xs py-1.5 px-4 text-center flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F28C28]" />
          <span className="font-bold text-[11px] tracking-wider uppercase text-white">
            HAQNAAMA LEGAL RESEARCH & STAKEHOLDER PLATFORM
          </span>
          <span className="hidden md:inline text-[10px] text-[#F4F0E6]/60">
            · Legal Research Fellowship (HLRF) & National Registry
          </span>
        </div>

        {/* Role Indicator & Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-[#F28C28] transition-colors"
          >
            <UserCheck className="w-3 h-3" />
            <span>Role: {fellowship.activeRole.replace('_', ' ')}</span>
            <ChevronDown className="w-3 h-3 text-white/60" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white text-[#202020] rounded-lg shadow-xl border border-[#202020]/20 py-1 text-left z-50 max-h-80 overflow-y-auto">
              <span className="block px-3 py-1 text-[9px] font-bold uppercase text-[#202020]/50 border-b border-gray-100">
                Fellowship (HLRF) Roles
              </span>
              {[
                'PUBLIC_VISITOR',
                'STUDENT_APPLICANT',
                'APPROVED_STUDENT',
                'MENTOR_APPLICANT',
                'APPROVED_MENTOR',
                'RESEARCH_COORDINATOR',
                'EDITOR',
                'RESEARCH_ETHICS_REVIEWER',
                'PROGRAM_ADMIN',
              ].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    fellowship.setActiveRole(r as any);
                    setActiveRole(r === 'PROGRAM_ADMIN' ? 'ADMINISTRATOR' : r === 'RESEARCH_COORDINATOR' ? 'REVIEWER' : 'RESEARCHER');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1 text-xs font-semibold hover:bg-[#FDF3E7] ${
                    fellowship.activeRole === r ? 'text-[#F28C28] font-bold bg-[#FDF3E7]/50' : 'text-[#202020]'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left focus-visible:ring-2 focus-visible:ring-[#F28C28] rounded-md transition-opacity"
              aria-label="HAQNAAMA Home"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#202020] uppercase">
                  HAQNAAMA
                </span>
                <span className="text-xs font-bold text-[#F28C28] uppercase tracking-wider">
                  Mapping
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-[#202020]/60 uppercase font-medium">
                National Geographic & Stakeholder OS
              </p>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.path || currentRoute.startsWith(`${link.path}/`);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`text-xs font-bold transition-colors whitespace-nowrap py-1 relative ${
                    isActive
                      ? 'text-[#202020] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F28C28]'
                      : 'text-[#202020]/75 hover:text-[#202020]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Language, Settings & Mobile Menu) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => handleLinkClick('/search')}
              className="p-2 text-[#202020]/75 hover:text-[#202020] hover:bg-black/5 rounded-md"
              title="Unified National Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-semibold text-[#202020] bg-white border border-[#202020]/15 hover:border-[#F28C28] rounded-md transition-all shadow-xs"
              title="Toggle Language"
            >
              <span className="text-[11px] font-bold">{preferences.language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            <button
              onClick={() => handleLinkClick('/coverage')}
              className="hidden sm:inline-flex p-2 text-[#202020]/75 hover:text-[#202020] hover:bg-black/5 rounded-md"
              title="Data Quality & Coverage"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleLinkClick('/settings')}
              className="p-2 text-[#202020]/75 hover:text-[#202020] hover:bg-black/5 rounded-md"
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleLinkClick('/admin')}
              className="hidden lg:inline-flex px-3 py-1.5 text-xs font-bold text-white bg-[#202020] hover:bg-black rounded-md transition-colors"
            >
              Admin
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#202020] hover:bg-black/5 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[calc(4rem+1.8rem)] bg-[#F4F0E6] border-b border-[#202020]/20 shadow-xl p-4 transition-all z-50 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col gap-1.5 text-xs font-bold" aria-label="Mobile Navigation">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left px-3 py-2 rounded-md hover:bg-black/5"
            >
              National Dashboard
            </button>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className="text-left px-3 py-2 rounded-md hover:bg-black/5"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-[#202020]/15 flex flex-col gap-1.5">
              <button
                onClick={() => handleLinkClick('/coverage')}
                className="text-left px-3 py-2 rounded-md hover:bg-black/5"
              >
                Data Quality & Coverage
              </button>
              <button
                onClick={() => handleLinkClick('/sources')}
                className="text-left px-3 py-2 rounded-md hover:bg-black/5"
              >
                Public Data Sources
              </button>
              <button
                onClick={() => handleLinkClick('/corrections')}
                className="text-left px-3 py-2 rounded-md hover:bg-black/5"
              >
                Correction & Dispute Centre
              </button>
              <button
                onClick={() => handleLinkClick('/methodology')}
                className="text-left px-3 py-2 rounded-md hover:bg-black/5"
              >
                Methodology & Verification Rules
              </button>
              <button
                onClick={() => handleLinkClick('/rights-navigator')}
                className="text-left px-3 py-2 rounded-md text-[#F28C28] hover:bg-black/5"
              >
                Citizen Rights Navigator (Stage 04)
              </button>
              <button
                onClick={() => handleLinkClick('/admin')}
                className="text-left px-3 py-2 rounded-md bg-[#202020] text-white"
              >
                Admin & Data Ingestion
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
