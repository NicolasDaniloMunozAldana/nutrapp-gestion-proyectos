import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMemberDetail } from '../api/trackingApi';
import type { TrackingFilters } from '../types/tracking';

export const useMemberDetail = (
  accountId: string | null | undefined,
  filters: TrackingFilters,
) => {
  return useQuery({
    queryKey: ['tracking', 'member', accountId ?? null, filters],
    queryFn: () => fetchMemberDetail(accountId as string, filters),
    enabled: !!accountId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  });
};
