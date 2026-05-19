import axios from 'axios';
import type {
  TrackingFilters,
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

export const triggerSyncRefresh = async (): Promise<{
  refreshed: boolean;
  retryAfterMs?: number;
}> => {
  try {
    const { data } = await client.post<{ refreshed: boolean }>('/sync/refresh');
    return data;
  } catch (err) {
    const e = err as { response?: { status?: number; data?: { retryAfterMs?: number } } };
    if (e.response?.status === 429) {
      return { refreshed: false, retryAfterMs: e.response.data?.retryAfterMs };
    }
    throw err;
  }
};
