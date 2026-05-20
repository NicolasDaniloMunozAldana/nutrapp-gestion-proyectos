import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const get = () =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches;
  const [matches, setMatches] = useState<boolean>(get);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

// Convenience presets used across the tracking surface.
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 640px)');
export const useIsTablet = (): boolean => useMediaQuery('(max-width: 1024px)');
