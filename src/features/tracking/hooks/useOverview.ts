import { keepPreviousData, useQuery } from '@tanstack/react-query';
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
    // Stale-while-revalidate: keep the previous overview visible while a new
    // fetch is in flight (e.g. after the manual refresh job invalidates the
    // query). UI shows the "Actualizando…" hint instead of an empty screen.
    placeholderData: keepPreviousData,
  });
};
