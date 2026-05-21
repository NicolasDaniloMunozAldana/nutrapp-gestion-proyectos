import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchSyncRefreshStatus,
  fetchSyncStatus,
  triggerSyncRefresh,
  type RefreshJob,
} from '../api/trackingApi';

export const useSyncStatus = () => {
  return useQuery({
    queryKey: ['tracking', 'sync', 'status'],
    queryFn: fetchSyncStatus,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

const POLL_INTERVAL_MS = 2_500;

interface SyncRefreshState {
  /** True while the backend job is running OR we just clicked. */
  isRefreshing: boolean;
  /** Soft error from the last job; UI should keep the previous snapshot visible. */
  error: string | null;
  /** True if the last manual click was rate-limited. */
  rateLimited: boolean;
  /** Last known job descriptor (running or done). */
  job: RefreshJob | null;
}

export const useSyncRefresh = () => {
  const qc = useQueryClient();
  const [state, setState] = useState<SyncRefreshState>({
    isRefreshing: false,
    error: null,
    rateLimited: false,
    job: null,
  });
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeenJobId = useRef<string | null>(null);

  const clearPoll = () => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  };

  // Cancel any pending poll on unmount.
  useEffect(() => () => clearPoll(), []);

  const poll = useCallback(async () => {
    try {
      const job = await fetchSyncRefreshStatus();
      if (!job) {
        // No job known on the server (e.g. process restarted) — stop polling.
        setState((s) => ({ ...s, isRefreshing: false }));
        return;
      }
      if (job.status === 'running') {
        setState((s) => ({ ...s, isRefreshing: true, job, error: null }));
        pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
        return;
      }
      // Terminal state. Only react if it's a job we hadn't acknowledged yet.
      const acknowledged = lastSeenJobId.current === job.id;
      if (!acknowledged) {
        lastSeenJobId.current = job.id;
        if (job.status === 'done') {
          // Invalidate all tracking queries so the UI swaps to the new snapshot.
          qc.invalidateQueries({ queryKey: ['tracking'] });
        }
      }
      setState({
        isRefreshing: false,
        error: job.status === 'error' ? job.error ?? 'Refresh falló' : null,
        rateLimited: false,
        job,
      });
    } catch (err) {
      // Polling failed (network blip, server restart). Don't keep retrying
      // forever — surface a soft error and let the user retry manually.
      setState((s) => ({
        ...s,
        isRefreshing: false,
        error: err instanceof Error ? err.message : 'No se pudo consultar el job',
      }));
    }
  }, [qc]);

  const mutate = useCallback(async () => {
    // Idempotent: if we're already polling a running job, ignore.
    if (state.isRefreshing) return;
    setState((s) => ({ ...s, isRefreshing: true, error: null, rateLimited: false }));
    try {
      const res = await triggerSyncRefresh();
      if (!res.refreshed) {
        // Rate-limited or no-op — surface that softly and stop.
        setState({
          isRefreshing: false,
          error: null,
          rateLimited: true,
          job: res.job,
        });
        return;
      }
      // Remember the new job id so we recognize when it finishes.
      lastSeenJobId.current = null;
      setState({ isRefreshing: true, error: null, rateLimited: false, job: res.job });
      clearPoll();
      pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
    } catch (err) {
      setState({
        isRefreshing: false,
        error: err instanceof Error ? err.message : 'No se pudo iniciar el refresh',
        rateLimited: false,
        job: null,
      });
    }
  }, [poll, state.isRefreshing]);

  // On mount, check if there is already a job running (e.g. another tab
  // triggered it) so we surface the "Actualizando…" state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const job = await fetchSyncRefreshStatus();
        if (cancelled || !job) return;
        if (job.status === 'running') {
          setState((s) => ({ ...s, isRefreshing: true, job, error: null }));
          clearPoll();
          pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          lastSeenJobId.current = job.id;
          setState((s) => ({ ...s, job }));
        }
      } catch {
        /* ignore — first paint shouldn't crash on a transient failure */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [poll]);

  const dismissError = useCallback(() => {
    setState((s) => ({ ...s, error: null, rateLimited: false }));
  }, []);

  return {
    mutate,
    isPending: state.isRefreshing,
    isRefreshing: state.isRefreshing,
    error: state.error,
    rateLimited: state.rateLimited,
    job: state.job,
    dismissError,
  };
};
