import {
  ResearchSession,
  DeepSearchResults,
  ProjectPlan,
  DashboardData,
  Workspace,
  ClusteringResults,
  RefreshResult,
} from '../types';

// Base URL of the real backend (backend/server.js). Configure via
// VITE_API_BASE_URL in .env if the backend isn't on localhost:5000.
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Matches the default userId the backend falls back to when none is passed
// (see search/controller.js, platform/controller.js).
const DEFAULT_USER_ID = 'user-student-1';

class ApiError extends Error {
  status: number;
  details?: string;
  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (err) {
    // Network-level failure (backend not running, CORS block, etc.)
    throw new ApiError(
      `Could not reach the backend at ${API_BASE_URL}. Is the server running (npm start in /backend)?`,
      0
    );
  }

  let body: any = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON body (e.g. empty 204) — leave body as null.
  }

  if (!response.ok) {
    const message = body?.error || `Request to ${path} failed with status ${response.status}`;
    throw new ApiError(message, response.status, body?.details);
  }

  return body as T;
}

// === REQUIRED SERVICE EXPORTS WITH EXACT SIGNATURES (unchanged from mock) ===

/**
 * POST /api/sessions - submits idea, returns a session.
 * Note: this is a blocking call that can take 5-15s (backend runs the full
 * search + summarize pipeline synchronously before responding) — the
 * existing multi-step loading UI in IdeaInputScreen already covers this.
 */
export async function createResearchSession(
  ideaText: string,
  language: string = 'en'
): Promise<ResearchSession> {
  return request<ResearchSession>('/sessions', {
    method: 'POST',
    body: JSON.stringify({ ideaText, userId: DEFAULT_USER_ID, language }),
  });
}

/**
 * GET /api/sessions/:sessionId/deepsearch - fetch deep search results.
 */
export async function getDeepSearchResults(sessionId: string): Promise<DeepSearchResults> {
  return request<DeepSearchResults>(`/sessions/${encodeURIComponent(sessionId)}/deepsearch`);
}

/**
 * GET /api/sessions/:sessionId/plan - fetch project plan for session.
 */
export async function getProjectPlan(sessionId: string): Promise<ProjectPlan> {
  return request<ProjectPlan>(`/sessions/${encodeURIComponent(sessionId)}/plan`);
}

/**
 * GET /api/dashboard/:userId - fetch dashboard summary data for user.
 */
export async function getDashboardData(userId: string = DEFAULT_USER_ID): Promise<DashboardData> {
  return request<DashboardData>(`/dashboard/${encodeURIComponent(userId)}`);
}

/**
 * GET /api/workspaces/:userId - fetch user workspaces.
 */
export async function getWorkspaces(userId: string = DEFAULT_USER_ID): Promise<Workspace[]> {
  return request<Workspace[]>(`/workspaces/${encodeURIComponent(userId)}`);
}

/**
 * GET /api/sessions/:sessionId/clusters - fetch thematic knowledge clusters
 * grouping the session's sources (Knowledge Clustering Layer 2 component).
 */
export async function getKnowledgeClusters(sessionId: string): Promise<ClusteringResults> {
  return request<ClusteringResults>(`/sessions/${encodeURIComponent(sessionId)}/clusters`);
}

/**
 * POST /api/sessions/:sessionId/refresh - re-runs the web search provider
 * against the session's original idea and returns any genuinely new sources
 * (deduped by URL) found since the session was created (Real-time Web
 * Intelligence Layer 2 component).
 */
export async function refreshWebIntelligence(sessionId: string): Promise<RefreshResult> {
  return request<RefreshResult>(`/sessions/${encodeURIComponent(sessionId)}/refresh`, {
    method: 'POST',
  });
}

/**
 * POST /api/workspaces/:workspaceId/save - save source item to a workspace.
 */
export async function saveToWorkspace(
  workspaceId: string,
  sourceId: string
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/workspaces/${encodeURIComponent(workspaceId)}/save`, {
    method: 'POST',
    body: JSON.stringify({ sourceId }),
  });
}

/**
 * POST /api/workspaces - create a new workspace.
 */
export async function createNewWorkspace(
  name: string,
  description: string = ''
): Promise<Workspace> {
  return request<Workspace>('/workspaces', {
    method: 'POST',
    body: JSON.stringify({ name, description, userId: DEFAULT_USER_ID }),
  });
}

/**
 * DELETE /api/workspaces/:workspaceId/items/:itemId - remove a saved item.
 */
export async function removeFromWorkspace(
  workspaceId: string,
  savedItemId: string
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(
    `/workspaces/${encodeURIComponent(workspaceId)}/items/${encodeURIComponent(savedItemId)}`,
    { method: 'DELETE' }
  );
}