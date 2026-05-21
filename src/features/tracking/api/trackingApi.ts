import axios from 'axios';
import type {
  TrackingFilters,
  TrackingIssueListItemDto,
  TrackingMemberDetailDto,
  TrackingOverviewDto,
  TrackingSyncStatusDto,
  TrackingTeamLoadDto,
} from '../types/tracking';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)

const client = axios.create({
  baseURL: `${API_BASE_URL}/tracking`,
  timeout: 30_000,
});

const filtersToParams = (filters: TrackingFilters | undefined): Record<string, string> => {
  const params: Record<string, string> = {};
  if (!filters) return params;
  if (filters.teamId) params.team = filters.teamId;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.priorities.length) params.priority = filters.priorities.join(',');
  return params;
};

export const fetchOverview = async (
  filters?: TrackingFilters,
): Promise<TrackingOverviewDto> => {
  const { data } = await client.get<TrackingOverviewDto>('/overview', {
    params: filtersToParams(filters),
  });
  return data;
};

export const fetchIssuesByEstado = async (
  estado: string,
  filters?: TrackingFilters,
): Promise<TrackingIssueListItemDto[]> => {
  const { data } = await client.get<TrackingIssueListItemDto[]>('/issues', {
    params: { ...filtersToParams(filters), estado },
  });
  return data;
};

export const fetchTeams = async (): Promise<TrackingTeamLoadDto[]> => {
  const { data } = await client.get<TrackingTeamLoadDto[]>('/teams');
  return data;
};

export const fetchMemberDetail = async (
  accountId: string,
  filters?: TrackingFilters,
): Promise<TrackingMemberDetailDto> => {
  const { data } = await client.get<TrackingMemberDetailDto>(
    `/members/${encodeURIComponent(accountId)}`,
    { params: filtersToParams(filters) },
  );
  return data;
};

export const fetchSyncStatus = async (): Promise<TrackingSyncStatusDto> => {
  const { data } = await client.get<TrackingSyncStatusDto>('/sync/status');
  return data;
};

export type RefreshJobStatus = 'running' | 'done' | 'error';

export interface RefreshJob {
  id: string;
  status: RefreshJobStatus;
  startedAt: string;
  finishedAt: string | null;
  generatedAt: string | null;
  error: string | null;
}

export interface TriggerRefreshResponse {
  refreshed: boolean;
  retryAfterMs?: number;
  job: RefreshJob;
}

export const triggerSyncRefresh = async (): Promise<TriggerRefreshResponse> => {
  try {
    // Backend now returns immediately (202) with the job descriptor; the
    // compose runs in background. Short timeout because this MUST be fast.
    const { data } = await client.post<TriggerRefreshResponse>(
      '/sync/refresh',
      undefined,
      { timeout: 8_000 },
    );
    return data;
  } catch (err) {
    const e = err as {
      response?: { status?: number; data?: TriggerRefreshResponse & { error?: string } };
    };
    if (e.response?.status === 429 && e.response.data?.job) {
      return {
        refreshed: false,
        retryAfterMs: e.response.data.retryAfterMs,
        job: e.response.data.job,
      };
    }
    throw err;
  }
};

export const fetchSyncRefreshStatus = async (): Promise<RefreshJob | null> => {
  const { data } = await client.get<{ job: RefreshJob | null }>(
    '/sync/refresh/status',
    { timeout: 8_000 },
  );
  return data.job;
};
