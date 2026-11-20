export type Language = 'en' | 'hi';
export type TextSize = 'standard' | 'large' | 'xlarge';
export type ContrastMode = 'standard' | 'high';
export type ExplanationStyle = 'simple' | 'detailed';

export type UserRole =
  | 'PUBLIC_USER'
  | 'REGISTERED_USER'
  | 'RESEARCHER'
  | 'DATA_IMPORTER'
  | 'REVIEWER'
  | 'ADMINISTRATOR';

export interface UserPreferences {
  id: string;
  language: Language;
  text_size: TextSize;
  contrast_mode: ContrastMode;
  reduced_motion: boolean;
  explanation_style: ExplanationStyle;
  onboarding_completed: boolean;
  analytics_consent: boolean;
  updated_at: string;
  activeRole?: UserRole;
}

export type VerificationStatus = 'verified' | 'unverified' | 'needs_recheck' | 'provisional';

// -------------------------------------------------------------
// PART 4: Administrative Geography Models
// -------------------------------------------------------------
export type AdminUnitType =
  | 'country'
  | 'state'
  | 'union_territory'
  | 'district'
  | 'tehsil'
  | 'taluk'
  | 'mandal'
  | 'subdivision'
  | 'block'
  | 'gram_panchayat'
  | 'urban_local_body'
  | 'village'
  | 'town'
  | 'ward';

export interface AdministrativeUnit {
  id: string;
  officialName: string;
  localName?: string;
  unitType: AdminUnitType;
  parentUnitId?: string;
  officialCode: string; // e.g. LGD Code / Census 2011 code
  codeSystem: 'LGD' | 'Census2011' | 'ISO-3166-2';
  jurisdictionId: string;
  validFrom: string;
  validTo?: string;
  administrativeStatus: 'active' | 'reorganized' | 'renamed' | 'superseded';
  boundaryReference?: string;
  centroidLatitude: number;
  centroidLongitude: number;
  sourceRecordId: string;
  sourceVersion: string;
  retrievedAt: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  subordinateCount?: number;
  entityCount?: number;
}

export interface AdministrativeBoundary {
  unitId: string;
  geometryType: 'Polygon' | 'MultiPolygon' | 'Point';
  coordinates: [number, number][] | [number, number][][];
  sourceUrl: string;
  isVerified: boolean;
}

export interface AdministrativeChange {
  id: string;
  unitId: string;
  changeType: 'renamed' | 'bifurcated' | 'merged' | 'upgraded';
  effectiveDate: string;
  gazetteNotificationNumber?: string;
  summary: string;
  sourceUrl: string;
}

// -------------------------------------------------------------
// PART 7: National Entity Registry Models
// -------------------------------------------------------------
export type EntityCategory =
  | 'government_ministry'
  | 'government_department'
  | 'district_administration'
  | 'local_body'
  | 'court_tribunal'
  | 'legal_aid_authority'
  | 'police_institution'
  | 'public_service'
  | 'registered_company'
  | 'llp'
  | 'ngo_nonprofit'
  | 'educational_institution'
  | 'civic_organization'
  | 'public_enterprise';

export interface NationalEntity {
  entityId: string;
  canonicalName: string;
  officialName: string;
  alternateNames: string[];
  entityType: EntityCategory;
  legalForm: string; // e.g. "Public Limited Company", "Constitutional Statutory Body"
  registrationNumber?: string; // CIN, LLPIN, Registration No, Act No
  registrationAuthority?: string; // MCA, Registrar of Societies, High Court
  identifierSystem?: string; // CIN / NGO Darpan / LSA
  jurisdictionId: string; // e.g. "district-kota", "state-rajasthan", "country-in"
  headquartersLocation: {
    city: string;
    state: string;
    district?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
  operatingLocationIds?: string[];
  parentEntityId?: string;
  officialWebsite?: string;
  sourceRecordIds: string[];
  registrationStatus: 'active' | 'struck_off' | 'amalgamated' | 'under_process';
  verificationStatus: VerificationStatus;
  validFrom: string;
  validTo?: string;
  lastVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
}

// -------------------------------------------------------------
// PART 8: Corporate Ownership & Shareholder Models
// -------------------------------------------------------------
export type OwnershipRelationshipType =
  | 'direct_shareholder'
  | 'parent_company'
  | 'subsidiary'
  | 'historical_shareholder'
  | 'beneficial_owner'
  | 'promoter_group'
  | 'institutional_investor';

export interface EntityOwnershipRecord {
  ownershipRecordId: string;
  ownedEntityId: string;
  ownerEntityId?: string;
  ownerPersonName?: string;
  relationshipType: OwnershipRelationshipType;
  shareCount?: number;
  shareholdingPercentage?: number; // e.g. 51.2%
  shareClass?: string; // e.g. "Equity Share Capital"
  ownershipBasis: string; // e.g. "Statutory Annual Return Form MGT-7 / BSE Shareholding Pattern"
  reportingPeriod: string; // e.g. "FY 2024-25"
  effectiveFrom: string;
  effectiveTo?: string;
  sourceRecordId: string;
  sourceDocumentReference: string;
  verificationStatus: VerificationStatus;
  reviewStatus: 'approved' | 'in_review' | 'flagged';
  lastVerifiedAt: string;
  notes?: string;
}

// -------------------------------------------------------------
// PART 9: Stakeholder Intelligence Graph Models
// -------------------------------------------------------------
export type GraphRelationshipType =
  | 'ownership'
  | 'parent_subsidiary'
  | 'directorship'
  | 'board_membership'
  | 'public_employment'
  | 'official_appointment'
  | 'government_jurisdiction'
  | 'legal_jurisdiction'
  | 'public_contract'
  | 'public_funding'
  | 'institutional_affiliation'
  | 'service_delivery'
  | 'geographic_presence'
  | 'partnership'
  | 'legal_proceeding';

export type GraphVerificationStatus =
  | 'UNVERIFIED'
  | 'SOURCE_IDENTIFIED'
  | 'SOURCE_RETRIEVED'
  | 'SOURCE_CHECKED'
  | 'HUMAN_REVIEWED'
  | 'CONFLICTING_EVIDENCE'
  | 'OUTDATED'
  | 'REJECTED'
  | 'SUPERSEDED';

export interface EntityRelationship {
  relationshipId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: GraphRelationshipType;
  description: string;
  validFrom: string;
  validTo?: string;
  sourceRecordId: string;
  sourceDocumentReference: string;
  sourcePassageReference?: string;
  verificationStatus: GraphVerificationStatus;
  reviewStatus: 'approved' | 'pending' | 'flagged';
  reviewerId?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// PART 10: Public Data Sources Models
// -------------------------------------------------------------
export interface PublicDataSource {
  sourceId: string;
  publisher: string;
  sourceName: string;
  sourceType:
    | 'government_portal'
    | 'statutory_registry'
    | 'corporate_filing'
    | 'court_repository'
    | 'gazette_notification'
    | 'census_lgd';
  officialUrl: string;
  accessMethod: 'open_public_api' | 'periodic_download' | 'authorized_gazette' | 'manual_verification';
  permittedUse: string;
  licenseReference: string;
  geographicCoverage: string;
  entityCategories: string[];
  publicationDate: string;
  reportingPeriod: string;
  retrievedAt: string;
  sourceVersion: string;
  lastVerifiedAt: string;
  verificationStatus: VerificationStatus;
  reviewStatus: 'approved' | 'review_pending' | 'stale';
  knownLimitations: string;
}

// -------------------------------------------------------------
// PART 14: Correction and Dispute Centre
// -------------------------------------------------------------
export interface CorrectionReport {
  id: string;
  targetType: 'entity' | 'geography' | 'relationship' | 'ownership' | 'source';
  targetId: string;
  targetName: string;
  reporterName: string;
  reporterEmail: string;
  issueType:
    | 'incorrect_name'
    | 'incorrect_relationship'
    | 'outdated_location'
    | 'incorrect_ownership'
    | 'unsupported_stakeholder'
    | 'outdated_source'
    | 'verification_dispute';
  description: string;
  evidenceReference?: string;
  status: 'SUBMITTED' | 'TRIAGED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'RESOLVED';
  reviewerNotes?: string;
  submittedAt: string;
  resolvedAt?: string;
}

// -------------------------------------------------------------
// Existing Legal Navigation Models (Preserved for compatibility)
// -------------------------------------------------------------
export interface OfficialResource {
  id: string;
  name: string;
  name_hi?: string;
  description: string;
  description_hi?: string;
  official_url: string;
  jurisdiction: string;
  category: string;
  contact_details?: {
    helpline?: string;
    email?: string;
    operating_hours?: string;
    address?: string;
  };
  source_authority: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
  effective_from?: string;
  review_notes: string;
  tags?: string[];
}

export type ModuleStatus = 'available' | 'beta' | 'coming_soon';

export interface ServiceModule {
  id: string;
  name: string;
  name_hi: string;
  description: string;
  description_hi: string;
  route: string;
  category: string;
  status: ModuleStatus;
  enabled: boolean;
  display_order: number;
  last_reviewed_at: string;
}

export interface ProblemCategory {
  id: string;
  title: string;
  title_hi: string;
  description: string;
  description_hi: string;
  icon: string;
  route: string;
  isAvailable: boolean;
  keywords: string[];
}

export type UrgencyLevel =
  | 'immediate_danger'
  | 'urgent_deadline'
  | 'financial_cyber_fraud'
  | 'important_not_urgent'
  | 'unsure';

export interface LegalProvision {
  id: string;
  legal_source_id: string;
  source_name: string;
  provision_number: string;
  heading: string;
  official_text: string;
  plain_language_explanation: string;
  jurisdiction: string;
  verification_status: VerificationStatus;
  reviewed_by: string;
  reviewed_at: string;
}

export interface LegalExplanation {
  id: string;
  title: string;
  topic: string;
  jurisdiction: string;
  explanation_text: string;
  plain_summary: string;
  provisions: LegalProvision[];
  last_reviewed_at: string;
  review_status: 'APPROVED' | 'IN_REVIEW' | 'DRAFT';
  reviewer_name: string;
}

export interface NavigatorSession {
  id: string;
  created_at: string;
  category: string;
  raw_problem_description: string;
  urgency: UrgencyLevel;
  answers: Record<string, string>;
  user_reported_facts: string[];
  unverified_assumptions: string[];
  missing_information: string[];
  matched_provisions: LegalProvision[];
  recommended_resources: OfficialResource[];
  next_step_checklist: {
    id: string;
    text: string;
    completed: boolean;
    isMandatory: boolean;
  }[];
  lawful_options: string[];
  disclaimer_acknowledged: boolean;
}

export interface LegalAidEligibilityAnswers {
  category: string;
  annual_income: string;
  is_woman_or_child: boolean;
  is_sc_st: boolean;
  is_custody: boolean;
  is_disabled: boolean;
  is_industrial_workman: boolean;
  jurisdiction: string;
}

export type EligibilityStatus =
  | 'potentially_eligible'
  | 'confirmation_required'
  | 'unable_to_determine'
  | 'completed';

export interface PreparedDraft {
  id: string;
  created_at: string;
  updated_at: string;
  template_type: 'consumer_grievance' | 'cyber_fraud_intimation' | 'police_representation' | 'rti_application';
  title: string;
  subject: string;
  recipient_authority: string;
  facts: string[];
  allegations_disclaimer: string;
  missing_placeholders: string[];
  draft_text: string;
  status: 'draft' | 'user_reviewed' | 'exported';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}
