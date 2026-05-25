import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import type { WorkAverageDto } from '../../types/tracking';

interface AverageCardProps {
  work: WorkAverageDto;
}

// Visual goal used only to scale the progress bar. Intentionally not labelled.
const GOAL = 9;

const toneColor = (tone: WorkAverageDto['tone']): string => {
  switch (tone) {
    case 'ok':
      return '#16A34A';
    case 'warn':
      return '#D97706';
    case 'danger':
      return '#DC2626';
    default:
      return '#94A3B8';
  }
};

export const AverageCard = ({ work }: AverageCardProps) => {
  const hasValue = work.promedio !== null;
  const value = work.promedio ?? 0;
  const pct = hasValue ? Math.min(100, Math.round((value / GOAL) * 100)) : 0;
  const accent = toneColor(work.tone);

  return (
    <Card
      padding={20}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        background: 'linear-gradient(180deg, #F5F7FF 0%, #FFFFFF 60%)',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>Promedio</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1 }}>
        <span
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: -1.6,
            color: hasValue ? '#0F172A' : '#CBD5E1',
          }}
        >
          {hasValue ? value.toFixed(1) : '—'}
        </span>
      </div>

      {/* Progress toward the (unlabelled) reference. */}
      <div
        style={{
          width: '100%',
          maxWidth: 160,
          height: 6,
          borderRadius: 999,
          background: '#EEF2F7',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 999,
            background: accent,
            transition: 'width .3s ease',
          }}
        />
      </div>

      {work.label ? (
        <Pill tone={work.tone} dot>
          {work.label}
        </Pill>
      ) : (
        <Pill tone="neutral" dot>
          Sin datos
        </Pill>
      )}

      {work.days > 0 && (
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
          {work.days} {work.days === 1 ? 'día' : 'días'}
        </div>
      )}
    </Card>
  );
};
