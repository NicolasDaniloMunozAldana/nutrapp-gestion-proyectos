export type RangePreset = 'today' | '7d' | '30d' | '60d' | 'sprint' | 'semester' | 'year';
export type FilterPreset = RangePreset | null;
export type PresetAction = RangePreset | 'clear';

// Range chips shown in the general filters bar, in ascending span order.
export const RANGE_PRESETS: PresetAction[] = [
  'today',
  '7d',
  'sprint',
  '30d',
  '60d',
  'semester',
  'year',
  'clear',
];

export const PRESET_LABELS: Record<PresetAction, string> = {
  today: 'Hoy',
  '7d': '7d',
  '30d': '30d',
  '60d': '60d',
  sprint: 'Sprint',
  semester: 'Semestre',
  year: 'Año',
  clear: 'Limpiar',
};

export const toISODate = (d: Date): string => d.toISOString().slice(0, 10);

export const defaultRange = (): { from: string; to: string } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);
  return { from: toISODate(start), to: toISODate(now) };
};

/**
 * Resolves a fixed-window range preset to its `from`/`to` ISO dates.
 * `semester` and `year` use calendar math (6 months / 1 year back) so they
 * stay accurate across month lengths; the rest are day windows. `sprint`
 * keeps its existing 14-day window.
 */
export const rangeForPreset = (preset: RangePreset): { from: string; to: string } => {
  const now = new Date();
  if (preset === 'today') {
    const d = toISODate(now);
    return { from: d, to: d };
  }
  const start = new Date(now);
  if (preset === 'semester') {
    start.setMonth(now.getMonth() - 6);
  } else if (preset === 'year') {
    start.setFullYear(now.getFullYear() - 1);
  } else {
    const days = preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '60d' ? 60 : 14;
    start.setDate(now.getDate() - days);
  }
  return { from: toISODate(start), to: toISODate(now) };
};
