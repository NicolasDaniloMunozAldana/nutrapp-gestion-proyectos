import { useQuery } from '@tanstack/react-query';
import { fetchOverview } from '../api/trackingApi';
import type { TrackingFilters } from '../types/tracking';

export const useOverview = (filters: TrackingFilters) => {
  return useQuery({
    queryKey: ['tracking', 'overview', filters],
    queryFn: () => fetchOverview(filters),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
