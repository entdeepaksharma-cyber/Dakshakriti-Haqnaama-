import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FellowshipProvider } from './context/FellowshipContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// HAQNAAMA Legal Research Fellowship (HLRF) Pages
import { FellowshipPublicPage } from './pages/fellowship/FellowshipPublicPage';
import { StudentApplicationPage } from './pages/fellowship/StudentApplicationPage';
import { MentorApplicationPage } from './pages/fellowship/MentorApplicationPage';
import { FellowshipProjectsPage } from './pages/fellowship/FellowshipProjectsPage';
import { TeamWorkspacePage } from './pages/fellowship/TeamWorkspacePage';
import { PublicationRepositoryPage } from './pages/fellowship/PublicationRepositoryPage';
import { FellowshipAdminPage } from './pages/fellowship/FellowshipAdminPage';
import { FellowshipTestsPage } from './pages/fellowship/FellowshipTestsPage';

// National Mapping & Intelligence Pages
import { HomePage } from './pages/HomePage';
import { IndiaMapPage } from './pages/IndiaMapPage';
import { AdministrativeGeographyPage } from './pages/AdministrativeGeographyPage';
import { EntityRegistryPage } from './pages/EntityRegistryPage';
import { EntityDetailPage } from './pages/EntityDetailPage';
import { CorporateOwnershipPage } from './pages/CorporateOwnershipPage';
import { StakeholderGraphPage } from './pages/StakeholderGraphPage';
import { NationalSearchPage } from './pages/NationalSearchPage';
import { PublicSourcesPage } from './pages/PublicSourcesPage';
import { ResearchWorkspacePage } from './pages/ResearchWorkspacePage';
import { DataQualityCoveragePage } from './pages/DataQualityCoveragePage';
import { CorrectionCentrePage } from './pages/CorrectionCentrePage';
import { MethodologyPage } from './pages/MethodologyPage';

// Preserved Citizen Legal Navigation Pages
import { RightsNavigatorPage } from './pages/RightsNavigatorPage';
import { LegalAidPage } from './pages/LegalAidPage';
import { OfficialResourcesPage } from './pages/OfficialResourcesPage';
import { ComplaintAssistantPage } from './pages/ComplaintAssistantPage';
import { LegalLiteracyPage } from './pages/LegalLiteracyPage';
import { CivicToolkitPage } from './pages/CivicToolkitPage';
import { MyWorkspacePage } from './pages/MyWorkspacePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentPage = () => {
    const normalized = currentRoute === '/' ? '/' : currentRoute.replace(/\/+$/, '');

    // 0. HAQNAAMA Legal Research Fellowship (HLRF) Routes
    if (normalized === '/fellowship') {
      return <FellowshipPublicPage />;
    }
    if (normalized === '/fellowship/apply-student') {
      return <StudentApplicationPage />;
    }
    if (normalized === '/fellowship/apply-mentor') {
      return <MentorApplicationPage />;
    }
    if (normalized.startsWith('/fellowship/projects')) {
      return <FellowshipProjectsPage />;
    }
    if (normalized.startsWith('/fellowship/workspace')) {
      const parts = normalized.split('/');
      const teamId = parts[3];
      return <TeamWorkspacePage teamId={teamId} />;
    }
    if (normalized === '/fellowship/publications') {
      return <PublicationRepositoryPage />;
    }
    if (normalized === '/fellowship/admin') {
      return <FellowshipAdminPage />;
    }
    if (normalized === '/fellowship/tests') {
      return <FellowshipTestsPage />;
    }

    // 1. National Mapping & Stakeholder Intelligence Routes
    if (normalized === '' || normalized === '/') {
      return <HomePage />;
    }
    if (normalized === '/india-map') {
      return <IndiaMapPage />;
    }
    if (normalized.startsWith('/geography')) {
      return <AdministrativeGeographyPage />;
    }
    if (normalized === '/entities') {
      return <EntityRegistryPage />;
    }
    if (normalized.startsWith('/entities/')) {
      const entityId = normalized.replace('/entities/', '');
      return <EntityDetailPage entityId={entityId} />;
    }
    if (normalized === '/institutions') {
      return <EntityRegistryPage initialType="court_tribunal" pageTitle="Government & Public Institutions" />;
    }
    if (normalized === '/companies') {
      return <CorporateOwnershipPage />;
    }
    if (normalized.startsWith('/companies/') && normalized.endsWith('/ownership')) {
      const companyId = normalized.replace('/companies/', '').replace('/ownership', '');
      return <CorporateOwnershipPage initialCompanyId={companyId} />;
    }
    if (normalized === '/shareholders') {
      return <CorporateOwnershipPage />;
    }
    if (normalized === '/stakeholders') {
      return <StakeholderGraphPage />;
    }
    if (normalized.startsWith('/stakeholders/')) {
      const entityId = normalized.replace('/stakeholders/', '');
      return <StakeholderGraphPage initialEntityId={entityId} />;
    }
    if (normalized.startsWith('/relationship/')) {
      return <StakeholderGraphPage />;
    }
    if (normalized === '/search') {
      return <NationalSearchPage />;
    }
    if (normalized === '/sources') {
      return <PublicSourcesPage />;
    }
    if (normalized === '/research') {
      return <ResearchWorkspacePage />;
    }
    if (normalized === '/coverage') {
      return <DataQualityCoveragePage />;
    }
    if (normalized === '/corrections') {
      return <CorrectionCentrePage />;
    }
    if (normalized === '/methodology') {
      return <MethodologyPage />;
    }

    // 2. Preserved Citizen Legal Navigation Routes
    if (normalized.startsWith('/rights-navigator')) {
      return <RightsNavigatorPage />;
    }
    if (normalized.startsWith('/legal-aid') || normalized === '/legal-help') {
      return <LegalAidPage />;
    }
    if (normalized === '/official-resources') {
      return <OfficialResourcesPage />;
    }
    if (normalized === '/complaint-assistant' || normalized === '/forms' || normalized === '/legal-drafting') {
      return <ComplaintAssistantPage />;
    }
    if (normalized === '/legal-literacy' || normalized === '/legal-research') {
      return <LegalLiteracyPage />;
    }
    if (normalized === '/civic-toolkit' || normalized === '/civic' || normalized === '/transparency') {
      return <CivicToolkitPage />;
    }
    if (normalized.startsWith('/my-workspace') || normalized.startsWith('/legal-matters')) {
      return <MyWorkspacePage />;
    }
    if (normalized === '/settings') {
      return <SettingsPage />;
    }
    if (normalized === '/about') {
      return <AboutPage />;
    }
    if (normalized === '/privacy') {
      return <PrivacyPage />;
    }
    if (normalized === '/terms') {
      return <TermsPage />;
    }
    if (normalized === '/contact' || normalized === '/feedback/content') {
      return <ContactPage />;
    }
    if (normalized.startsWith('/admin')) {
      return <AdminPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E6] text-[#202020] selection:bg-[#F28C28]/20 selection:text-[#202020]">
      {/* Universal Skip-to-Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 bg-[#202020] text-white rounded-md outline-2 outline-[#F28C28]"
      >
        Skip to main content
      </a>

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* User Onboarding & Personalization Modal */}
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <FellowshipProvider>
        <AppContent />
      </FellowshipProvider>
    </AppProvider>
  );
}
