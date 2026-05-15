export const trackingTokens = {
  font: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  bg: {
    app: '#F8FAFC',
    card: '#FFFFFF',
    sidebar: '#0F172A',
    soft: '#F1F5F9',
    softer: '#F8FAFC',
  },
  text: {
    base: '#0F172A',
    muted: '#475569',
    softer: '#64748B',
    fade: '#94A3B8',
  },
  border: {
    soft: '#EEF2F7',
    softer: '#F1F5F9',
  },
  status: {
    ok: { fg: '#15803D', bg: '#DCFCE7', dot: '#22C55E', border: '#86EFAC' },
    warn: { fg: '#B45309', bg: '#FEF3C7', dot: '#F59E0B', border: '#FCD34D' },
    danger: { fg: '#B91C1C', bg: '#FEE2E2', dot: '#EF4444', border: '#FCA5A5' },
    deploy: { fg: '#6D28D9', bg: '#EDE9FE', dot: '#8B5CF6', border: '#C4B5FD' },
    blue: { fg: '#1D4ED8', bg: '#DBEAFE', dot: '#2563EB', border: '#93C5FD' },
    neutral: { fg: '#334155', bg: '#F1F5F9', dot: '#94A3B8', border: '#E2E8F0' },
  },
  team: {
    palette: [
      '#F472B6',
      '#34D399',
      '#FB923C',
      '#60A5FA',
      '#A78BFA',
      '#F87171',
      '#22D3EE',
      '#FBBF24',
      '#10B981',
      '#E879F9',
    ],
  },
  shadow: {
    soft: '0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.04)',
    hover: '0 8px 24px rgba(15,23,42,0.10)',
  },
};

export const colorForTeam = (key: string | null | undefined): string => {
  if (!key) return trackingTokens.team.palette[0];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return trackingTokens.team.palette[h % trackingTokens.team.palette.length];
};

export const colorForUser = (key: string | null | undefined): string => {
  if (!key) return '#94A3B8';
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const palette = trackingTokens.team.palette;
  return palette[h % palette.length];
};
