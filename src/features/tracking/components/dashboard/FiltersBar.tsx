import type { CSSProperties } from 'react';
import { trackingTokens } from '../../styles/tokens';

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
  onPreset: (preset: 'today' | '7d' | '30d' | 'sprint' | 'clear') => void;
}

const PRIORITY_OPTIONS = ['Crítica', 'Alta', 'Media', 'Baja'];

const fieldStyle: CSSProperties = {
  height: 36,
  borderRadius: 10,
  border: `1px solid ${trackingTokens.border.soft}`,
  background: '#fff',
  color: '#0F172A',
  fontSize: 13,
  padding: '0 10px',
  fontWeight: 600,
};

const chipStyle = (active: boolean): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '5px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  background: active ? '#0F172A' : '#F1F5F9',
  color: active ? '#fff' : '#475569',
  border: 'none',
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
}: FiltersBarProps) => {
  const togglePriority = (p: string) => {
    const lower = p.toLowerCase();
    const exists = priorities.some((x) => x.toLowerCase() === lower);
    if (exists) onPrioritiesChange(priorities.filter((x) => x.toLowerCase() !== lower));
    else onPrioritiesChange([...priorities, p]);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${trackingTokens.border.soft}`,
        boxShadow: trackingTokens.shadow.soft,
      }}
    >
      <select value={teamId} onChange={(e) => onTeamChange(e.target.value)} style={fieldStyle}>
        <option value="">Todos los equipos</option>
        {teamOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Desde</label>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          style={fieldStyle}
        />
        <label style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Hasta</label>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          style={fieldStyle}
        />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['today', '7d', '30d', 'sprint', 'clear'] as const).map((p) => (
          <button key={p} type="button" onClick={() => onPreset(p)} style={chipStyle(false)}>
            {p === 'today' ? 'Hoy' : p === '7d' ? '7d' : p === '30d' ? '30d' : p === 'sprint' ? 'Sprint' : 'Limpiar'}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          marginLeft: 'auto',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Prioridad:</span>
        {PRIORITY_OPTIONS.map((p) => {
          const active = priorities.some((x) => x.toLowerCase() === p.toLowerCase());
          return (
            <button key={p} type="button" onClick={() => togglePriority(p)} style={chipStyle(active)}>
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
};
