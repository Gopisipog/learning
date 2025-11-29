export interface MatchRequest {
  resume_text: string;
  jd_text: string;
  top_k_skills: number;
  expected_years: number;
  use_semantic_scoring: boolean;
}

export interface MatchResult {
  overall_score: number;
  skill_match_score?: number;
  experience_match_score?: number;
  semantic_score?: number;
  matched_skills?: string[];
  missing_skills?: string[];
  resume_years?: number;
  experience_gap?: number;
  recommendation?: string;
}

export interface BatchMatchResponse {
  results: MatchResult[];
  request_id?: string;
  status?: string;
}

export const TOP_K_SKILLS_OPTIONS = [5, 10, 15, 20, 25, 30];
export const EXPECTED_YEARS_OPTIONS = [0, 1, 2, 3, 5, 7, 10, 15];

