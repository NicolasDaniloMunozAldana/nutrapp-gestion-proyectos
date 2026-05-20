import { useQuery } from '@tanstack/react-query';
import { fetchIssuesByEstado } from '../api/trackingApi';
import type { TrackingFilters } from '../types/tracking';

export const useIssuesByEstado = (
  estado: string | null,
  filters: TrackingFilters,
) => {
  return useQuery({
    queryKey: ['tracking', 'issues-by-estado', estado, filters],
    queryFn: () => fetchIssuesByEstado(estado as string, filters),
    enabled: !!estado,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
