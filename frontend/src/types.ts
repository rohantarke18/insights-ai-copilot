export type SourceType = 'web' | 'github' | 'paper';

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  snippet: string;
  url: string;
  citationIndex: number;
  authors?: string;
  publishedYear?: string;
  stars?: number;
  relevanceScore?: number;
  workspaceSaved?: boolean;
}

export interface DeepSearchResults {
  sessionId: string;
  summary: string;
  sources: Source[];
}

export interface TechStackCategory {
  category: string;
  items: string[];
}

export interface Milestone {
  title: string;
  description: string;
  estimatedDate: string;
  complexity?: 'Low' | 'Medium' | 'High';
  deliverables?: string[];
}

export interface ApiOrDataset {
  name: string;
  type: 'api' | 'dataset';
  description: string;
  link: string;
  license?: string;
}

export interface ProjectPlan {
  sessionId: string;
  architecture: string;
  techStack: TechStackCategory[];
  milestones: Milestone[];
  apisAndDatasets: ApiOrDataset[];
}

export interface ResearchSession {
  sessionId: string;
  ideaText: string;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
  sourcesCount?: number;
}

export interface DashboardStats {
  ideasExplored: number;
  sourcesAnalyzed: number;
  plansGenerated: number;
}

export interface DashboardData {
  stats: DashboardStats;
  sessions: ResearchSession[];
}

export interface SavedSourceItem {
  id: string;
  sourceId: string;
  title: string;
  snippet: string;
  type: SourceType;
  url: string;
  savedAt: string;
  citationIndex?: number;
}

export interface Workspace {
  workspaceId: string;
  name: string;
  itemCount: number;
  updatedAt: string;
  description?: string;
  items?: SavedSourceItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

