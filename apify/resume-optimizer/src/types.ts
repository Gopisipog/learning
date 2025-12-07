export interface OptimizeRequest {
  ResumeText: string;
  WritingStyle: 'Professional' | 'Casual' | 'Academic' | 'Creative';
  FormattingOptions: {
    TemplateStyle: '1' | '2' | '3' | '4' | '5';
  };
}

export interface ContactInformation {
  CandidateName: string;
  Email: string;
  Telephone: string;
  WebSites: string[];
  City: string;
  State: string;
  ZipCode: string;
  DateOfBirth: string;
  Nationality: string;
  MaritalStatus: string;
  Gender: string;
}

export interface WorkPosition {
  PositionNumber: number;
  EmployerName: string;
  JobTitle: string;
  StartDate: string;
  EndDate: string;
  PositionDescription: string;
  Accomplishments: string[];
  Location: string;
  KeySkillsApplied: string[] | null;
}

export interface Education {
  SchoolName: string;
  DegreeName: string;
  GraduationDate: string;
  AreaOfStudy: string;
  Location: string;
  GradePointAverage: string;
}

export interface OptimizedResumeJson {
  ContactInformation: ContactInformation;
  WorkHistoryPositions: WorkPosition[];
  EducationDetails: Education[];
  Skills: string[];
  TechnicalSkills: string[];
  ProfessionalSkills: string[];
  SoftSkills: string[] | null;
  ProfessionalSummary: string;
  Certifications: string[] | null;
  AwardsAndAchievements: string[] | null;
  Languages: string[] | null;
  Projects: unknown[] | null;
}

export interface OptimizeResponse {
  OptimizedResumeAsBase64String?: string;
  CoverLetterAsBase64String?: string | null;
  CandidateName?: string;
  OptimizationBoost?: number;
  OptimizedResumeAsJson?: OptimizedResumeJson;
  StatusCode?: string;
  Message?: string;
  CreditsRemaining?: number;
  error?: string;
}

export type WritingStyle = 'Professional' | 'Casual' | 'Academic' | 'Creative';
export type TemplateStyle = '1' | '2' | '3' | '4' | '5';

