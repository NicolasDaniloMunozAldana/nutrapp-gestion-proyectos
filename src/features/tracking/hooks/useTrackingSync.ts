import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSyncStatus, triggerSyncRefresh } from '../api/trackingApi';

export const useSyncStatus = () => {
  return useQuery({
    queryKey: ['tracking', 'sync', 'status'],
    queryFn: fetchSyncStatus,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useSyncRefresh = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: triggerSyncRefresh,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tracking'] });
    },
  });
};
