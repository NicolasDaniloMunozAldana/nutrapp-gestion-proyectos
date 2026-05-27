import type { CSSProperties } from 'react';
import { trackingTokens } from '../../styles/tokens';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { RANGE_PRESETS, PRESET_LABELS } from '../../utils/ranges';
import type { FilterPreset, PresetAction } from '../../utils/ranges';

interface FiltersBarProps {
  teamOptions: Array<{ id: string; name: string }>;
  teamId: string;
  onTeamChange: (id: string) => void;
  priorities: string[];
  onPrioritiesChange: (next: string[]) => void;
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onPreset: (preset: PresetAction) => void;
  activePreset?: FilterPreset;
}

const PRIORITY_OPTIONS = ['Crítica', 'Alta', 'Media', 'Baja'];

const fieldStyle = (isMobile: boolean): CSSProperties => ({
  height: isMobile ? 40 : 36,
  borderRadius: 10,
  border: `1px solid ${trackingTokens.border.soft}`,
  background: '#fff',
  color: '#0F172A',
  fontSize: 13,
  padding: '0 10px',
  fontWeight: 600,
  minWidth: 0,
  width: '100%',
});

const chipStyle = (active: boolean, isMobile: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: isMobile ? '8px 12px' : '5px 10px',
  minHeight: isMobile ? 36 : 'auto',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  background: active ? '#0F172A' : '#F1F5F9',
  color: active ? '#fff' : '#475569',
  border: 'none',
  whiteSpace: 'nowrap',
});

export const FiltersBar = ({
  teamOptions,
  teamId,
  onTeamChange,
  priorities,
  onPrioritiesChange,
  from,
  to,
  onFromChange,
  onToChange,
  onPreset,
  activePreset = null,
}: FiltersBarProps) => {
  const isMobile = useIsMobile();
  const togglePriority = (p: string) => {
    const lower = p.toLowerCase();
    const exists = priorities.some((x) => x.toLowerCase() === lower);
    if (exists) onPrioritiesChange(priorities.filter((x) => x.toLowerCase() !== lower));
    else onPrioritiesChange([...priorities, p]);
  };
  const field = fieldStyle(isMobile);
  return (
    <div
      style={{
        display: isMobile ? 'grid' : 'flex',
        gridTemplateColumns: isMobile ? '1fr' : undefined,
        flexWrap: isMobile ? undefined : 'wrap',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 10 : 12,
        padding: isMobile ? '12px' : '12px 16px',
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${trackingTokens.border.soft}`,
        boxShadow: trackingTokens.shadow.soft,
      }}
    >
      <select
        value={teamId}
        onChange={(e) => onTeamChange(e.target.value)}
        style={field}
      >
        <option value="">Todos los equipos</option>
        {teamOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: 8,
          minWidth: isMobile ? 0 : 240,
        }}
      >
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: 11,
            color: '#64748B',
            fontWeight: 600,
            minWidth: 0,
          }}
        >
          Desde
          <input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            style={field}
          />
        </label>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: 11,
            color: '#64748B',
            fontWeight: 600,
            minWidth: 0,
          }}
        >
          Hasta
          <input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            style={field}
          />
        </label>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: isMobile ? 2 : 0,
        }}
      >
        {RANGE_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPreset(p)}
            style={chipStyle(p !== 'clear' && activePreset === p, isMobile)}
          >
            {PRESET_LABELS[p]}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          marginLeft: isMobile ? 0 : 'auto',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          overflowX: isMobile ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: isMobile ? 2 : 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: '#64748B',
            fontWeight: 600,
            flex: 'none',
          }}
        >
          Prioridad:
        </span>
        {PRIORITY_OPTIONS.map((p) => {
          const active = priorities.some((x) => x.toLowerCase() === p.toLowerCase());
          return (
            <button
              key={p}
              type="button"
              onClick={() => togglePriority(p)}
              style={chipStyle(active, isMobile)}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
};
