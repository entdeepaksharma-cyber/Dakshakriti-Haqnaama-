/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HAQNAAMA Legal Research Fellowship (HLRF)
 * Canonical Database & Workflow Types
 */

export type FellowshipUserRole =
  | 'PUBLIC_VISITOR'
  | 'STUDENT_APPLICANT'
  | 'APPROVED_STUDENT'
  | 'MENTOR_APPLICANT'
  | 'APPROVED_MENTOR'
  | 'RESEARCH_COORDINATOR'
  | 'EDITOR'
  | 'RESEARCH_ETHICS_REVIEWER'
  | 'PROGRAM_ADMIN';

export type StudentApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INFORMATION_REQUESTED'
  | 'INTERVIEW'
  | 'ACCEPTED'
  | 'WAITLISTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type MentorApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CREDENTIAL_CHECK'
  | 'INTERVIEW'
  | 'APPROVED'
  | 'CONDITIONAL_APPROVAL'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'WITHDRAWN';

export type ResearchProjectStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'REVISION_REQUIRED'
  | 'APPROVED'
  | 'OPEN_FOR_APPLICATIONS'
  | 'APPLICATIONS_CLOSED'
  | 'TEAM_FORMED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type ExpectedResearchOutput =
  | 'journal_article'
  | 'working_paper'
  | 'case_comment'
  | 'policy_brief'
  | 'legal_research_report'
  | 'comparative_law_study';

export type ManuscriptLifecycleStage =
  | 'PROJECT_APPROVAL'
  | 'STUDENT_SELECTION'
  | 'TEAM_FORMATION'
  | 'RESEARCH_PLAN'
  | 'LITERATURE_REVIEW'
  | 'SOURCE_COLLECTION'
  | 'ANALYSIS'
  | 'FIRST_DRAFT'
  | 'MENTOR_REVIEW'
  | 'REVISION'
  | 'CITATION_CHECK'
  | 'ETHICS_CHECK'
  | 'FINAL_TEAM_APPROVAL'
  | 'EDITORIAL_REVIEW'
  | 'SUBMISSION_PREPARATION'
  | 'EXTERNAL_SUBMISSION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'REVISION_REQUESTED'
  | 'ARCHIVED';

export type SourceType =
  | 'case_law'
  | 'legislation'
  | 'rules_regulations'
  | 'govt_report'
  | 'academic_publication'
  | 'book'
  | 'law_commission_report'
  | 'parliamentary_material'
  | 'official_statistics'
  | 'other';

export type SourceVerificationStatus =
  | 'VERIFIED_PRIMARY'
  | 'VERIFIED_SECONDARY'
  | 'UNVERIFIED'
  | 'FLAGGED_INVALID';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: FellowshipUserRole;
  affiliation?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentApplication {
  id: string;
  applicantId: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  degree: string;
  currentSemesterYear: string;
  areasOfLegalInterest: string[];
  languages: string[];
  researchExperience: string;
  writingSampleText?: string;
  writingSampleTitle?: string;
  learningObjectives: string;
  availabilityHoursPerWeek: number;
  preferredThemes: string[];
  relevantSkills: string[];
  consentAndDeclarations: {
    truthfulnessConfirmed: boolean;
    ethicsPolicyAccepted: boolean;
    nonPlagiarismPledged: boolean;
    availabilityCommitment: boolean;
  };
  status: StudentApplicationStatus;
  requestedInfoNotes?: string;
  interviewDate?: string;
  reviewerNotes?: string;
  decisionDate?: string;
  appliedProjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorApplication {
  id: string;
  mentorId: string;
  name: string;
  email: string;
  phone: string;
  professionalRole: string; // e.g. Assistant Professor, Advocate, Senior Research Fellow
  qualifications: string; // LL.M., Ph.D. in Law, etc.
  institutionalAffiliation: string;
  researchExpertise: string[];
  publicationsPortfolio: string; // List of actual publications or citations
  languages: string[];
  mentoringExperience: string;
  proposedResearchTopics: string;
  availabilityHoursPerWeek: number;
  maxTeamCapacity: number; // default 1 team, 2-3 students
  conflictOfInterestDeclaration: string;
  professionalConductDeclaration: boolean;
  referencesCredentials: string;
  credentialsVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  status: MentorApplicationStatus;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorCredential {
  id: string;
  mentorAppId: string;
  documentName: string;
  documentType: 'degree_certificate' | 'bar_council_id' | 'faculty_id' | 'publication_proof';
  fileDataSummary: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  notes?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  abstract: string;
  researchQuestion: string;
  objectives: string[];
  legalSubject: string; // e.g. Constitutional Law, Environmental Law, Cyber Law, Criminal Procedure
  jurisdiction: string; // India / Rajasthan / Comparative
  methodology: string; // Doctrinal, Empirical, Comparative
  existingLiteratureSummary: string;
  proposedContribution: string;
  expectedOutput: ExpectedResearchOutput;
  estimatedDurationMonths: number;
  studentSkillsRequired: string[];
  languages: string[];
  sourceAvailabilityNotes: string;
  ethicalConsiderations: string;
  humanParticipantsInvolved: boolean;
  personalDataConsiderations: string;
  conflictOfInterestDisclosures: string;
  publicationGoals: string;
  mentorId: string;
  mentorName: string;
  mentorCapacity: number;
  status: ResearchProjectStatus;
  coordinatorNotes?: string;
  cycleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentUniversity: string;
  statementOfInterest: string;
  relevantSkills: string[];
  preferredRole: string;
  status: 'SUBMITTED' | 'SHORTLISTED' | 'INTERVIEW' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';
  aiMatchScore?: number; // 0-100 advisory score
  aiMatchExplanation?: string;
  coordinatorDecisionNotes?: string;
  appliedAt: string;
  decidedAt?: string;
}

export interface ResearchTeam {
  id: string;
  projectId: string;
  projectTitle: string;
  mentorId: string;
  mentorName: string;
  teamName: string;
  status: 'FORMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  maxStudents: number; // default 3
  createdAt: string;
}

export interface TeamMembership {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRoleInTeam: 'MENTOR' | 'STUDENT_COAUTHOR' | 'COORDINATOR';
  joinedAt: string;
  isAuthorshipEligible: boolean;
}

export interface ResearchMilestone {
  id: string;
  teamId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'DELAYED';
  orderIndex: number;
  mentorFeedback?: string;
}

export interface ResearchTask {
  id: string;
  teamId: string;
  title: string;
  description: string;
  assignedToUserId?: string;
  assignedToName?: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ResearchMeeting {
  id: string;
  teamId: string;
  meetingTitle: string;
  scheduledAt: string;
  agenda: string;
  meetingNotes?: string;
  actionItems?: string[];
  attendees: string[];
}

export interface ResearchNote {
  id: string;
  teamId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSource {
  id: string;
  teamId: string;
  title: string;
  authorOrInstitution: string;
  publicationDate: string;
  jurisdiction: string;
  sourceType: SourceType;
  officialOrPublisherUrl?: string;
  citationMetadata: string; // Indian Bluebook / standard citation format
  accessDate: string;
  relevantPageOrParagraph: string;
  researcherNotes: string;
  verificationStatus: SourceVerificationStatus;
  isPrimarySource: boolean;
}

export interface ResearchCitation {
  id: string;
  teamId: string;
  manuscriptId: string;
  sourceId: string;
  sourceTitle: string;
  pinCite: string;
  citedProposition: string;
  citationCompleteness: 'COMPLETE' | 'INCOMPLETE' | 'NEEDS_CHECK';
}

export interface Manuscript {
  id: string;
  teamId: string;
  projectId: string;
  title: string;
  abstract: string;
  currentVersionNumber: number;
  content: string;
  currentStage: ManuscriptLifecycleStage;
  lastEditedBy: string;
  lastEditedAt: string;
}

export interface ManuscriptVersion {
  id: string;
  manuscriptId: string;
  versionNumber: number;
  title: string;
  content: string;
  wordCount: number;
  changeSummary: string;
  savedByUserId: string;
  savedByName: string;
  savedAt: string;
}

export interface ManuscriptComment {
  id: string;
  manuscriptId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  section: string;
  commentText: string;
  suggestedEdit?: string;
  resolved: boolean;
  createdAt: string;
}

export interface AuthorshipAgreement {
  id: string;
  teamId: string;
  projectId: string;
  version: number;
  agreedRolesSummary: string;
  signedDate?: string;
  isSignedByAll: boolean;
  mentorSigned: boolean;
  studentsSigned: Record<string, boolean>; // studentId -> boolean
  termsAcceptedNotes?: string;
  notes?: string;
}

export interface ContributorRole {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  formalCreditTitle: string; // e.g. "Primary Co-Author", "Research Associate"
  substantiveContributions: {
    conceptualization: boolean;
    methodology: boolean;
    primarySourceResearch: boolean;
    draftWriting: boolean;
    criticalRevision: boolean;
    citationVerification: boolean;
  };
  agreedOrder: number;
}

export interface EthicsReview {
  id: string;
  teamId: string;
  projectId: string;
  reviewerId: string;
  reviewerName: string;
  originalityScoreOrNotes: string;
  properAttributionConfirmed: boolean;
  plagiarismChecked: boolean;
  citationAccuracyChecked: boolean;
  dataIntegrityConfirmed: boolean;
  confidentialityProtected: boolean;
  personalDataHandledSafely: boolean;
  conflictsOfInterestDisclosed: boolean;
  humanParticipantApprovalConfirmed: boolean;
  aiAssistanceDisclosed: boolean;
  limitationsAcknowledged: boolean;
  status: 'PENDING' | 'REQUEST_MODIFICATIONS' | 'APPROVED' | 'REJECTED';
  reviewComments: string;
  reviewedAt: string;
}

export interface ConflictOfInterest {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userRole: string;
  disclosureText: string;
  mitigationSteps: string;
  status: 'DISCLOSED' | 'CLEARED' | 'ACTION_REQUIRED';
  recordedAt: string;
}

export interface PublicationRecord {
  id: string;
  manuscriptId: string;
  projectId: string;
  title: string;
  authors: string[];
  abstract: string;
  outputType: ExpectedResearchOutput;
  targetJournalOrPublisher: string;
  submissionDate?: string;
  externalStatus:
    | 'NOT_SUBMITTED'
    | 'SUBMITTED'
    | 'UNDER_PEER_REVIEW'
    | 'REVISIONS_REQUESTED'
    | 'ACCEPTED_IN_PRESS'
    | 'PUBLISHED'
    | 'REJECTED'
    | 'WITHDRAWN';
  publicationDate?: string;
  doiOrPersistentId?: string;
  volumeIssuePages?: string;
  fullTextAccessUrl?: string;
  fullTextContent?: string;
  fullTextApprovedForPublic: boolean;
  correctionNotes?: string;
  withdrawalNotice?: string;
}

export interface CertificateRecord {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  role: 'MENTOR' | 'STUDENT_COAUTHOR';
  projectTitle: string;
  completionDate: string;
  verifiedByCoordinatorId: string;
  certificateNumber: string;
  isEligible: boolean;
  issuedAt?: string;
}

export interface FellowshipNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'application' | 'review' | 'team' | 'milestone' | 'manuscript' | 'ethics' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface FellowshipCorrectionRequest {
  id: string;
  targetPublicationId: string;
  targetTitle: string;
  requesterName: string;
  requesterEmail: string;
  descriptionOfError: string;
  evidenceProvided: string;
  status: 'RECEIVED' | 'INVESTIGATING' | 'CORRECTION_ISSUED' | 'RETRACTED' | 'DISMISSED';
  resolutionNotes?: string;
  submittedAt: string;
}

export interface FellowshipAuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: FellowshipUserRole;
  action: string;
  targetEntity: string;
  details: string;
}

export interface ProgrammeConfig {
  currentCycleName: string;
  currentCycleSemester: string;
  studentApplicationDeadline: string;
  mentorApplicationDeadline: string;
  selectionAnnouncementDate: string;
  fellowshipStartDate: string;
  fellowshipEndDate: string;
  defaultMinStudentsPerTeam: number;
  defaultMaxStudentsPerTeam: number;
  allowNonLawStudents: boolean;
  requireWritingSample: boolean;
  ethicsCheckMandatory: boolean;
  authorshipAgreementMandatory: boolean;
}
