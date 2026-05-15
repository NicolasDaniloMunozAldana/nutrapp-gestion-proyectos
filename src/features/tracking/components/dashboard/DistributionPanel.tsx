import { Card } from '../shared/Card';

interface DistributionPanelProps {
  data: Array<{ id: string; n: number }>;
}

const BUCKETS = [
  { id: 'Crítica', color: '#EF4444', match: /crit/i },
  { id: 'Alta', color: '#F59E0B', match: /alta|high/i },
  { id: 'Media', color: '#2563EB', match: /media|medium/i },
  { id: 'Baja', color: '#94A3B8', match: /baja|low/i },
];

export const DistributionPanel = ({ data }: DistributionPanelProps) => {
  const counts = BUCKETS.map((b) => ({
    ...b,
    n: data
      .filter((d) => b.match.test(d.id))
      .reduce((s, d) => s + d.n, 0),
  }));
  const total = counts.reduce((s, b) => s + b.n, 0);
  if (total === 0) return null;
  const R = 56;
  const C = 70;
  let acc = 0;
  return (
    <Card padding={20}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
        Distribución por prioridad
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16 }}>
        <svg width={C * 2} height={C * 2} viewBox={`0 0 ${C * 2} ${C * 2}`}>
          <circle cx={C} cy={C} r={R} stroke="#F1F5F9" strokeWidth="14" fill="none" />
          {counts.map((b) => {
            const frac = b.n / total;
            const len = frac * 2 * Math.PI * R;
            const offset = -acc * 2 * Math.PI * R;
            const el = (
              <circle
                key={b.id}
                cx={C}
                cy={C}
                r={R}
                stroke={b.color}
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${len} ${2 * Math.PI * R - len}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${C} ${C})`}
                strokeLinecap="butt"
              />
            );
            acc += frac;
            return el;
          })}
          <text x={C} y={C - 2} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">
            {total}
          </text>
          <text x={C} y={C + 16} textAnchor="middle" fontSize="10" fontWeight="600" fill="#94A3B8">
            TICKETS
          </text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {counts.map((b) => (
            <div
              key={b.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  color: '#0F172A',
                  fontWeight: 500,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color }} />
                {b.id}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                {b.n}{' '}
                <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 500 }}>
                  · {total > 0 ? Math.round((100 * b.n) / total) : 0}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
