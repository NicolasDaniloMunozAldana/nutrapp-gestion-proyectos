import { useQuery } from '@tanstack/react-query';
import { fetchTeams } from '../api/trackingApi';

export const useTeams = () => {
  return useQuery({
    queryKey: ['tracking', 'teams'],
    queryFn: fetchTeams,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
