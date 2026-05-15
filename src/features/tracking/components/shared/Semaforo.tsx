import type { TrackingSemaforo } from '../../types/tracking';

interface SemaforoProps {
  level: TrackingSemaforo;
  size?: number;
}

const COLS: Record<TrackingSemaforo, string> = {
  ok: '#22C55E',
  warn: '#F59E0B',
  danger: '#EF4444',
};

export const Semaforo = ({ level, size = 8 }: SemaforoProps) => {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {(['ok', 'warn', 'danger'] as TrackingSemaforo[]).map((l) => (
        <span
          key={l}
          style={{
            width: size,
            height: size,
            borderRadius: 999,
            background: level === l ? COLS[l] : '#E2E8F0',
            boxShadow: level === l ? `0 0 0 3px ${COLS[l]}1A` : 'none',
          }}
        />
      ))}
    </span>
  );
};
