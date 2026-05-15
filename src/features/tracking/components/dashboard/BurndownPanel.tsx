import { Card } from '../shared/Card';

interface BurndownPanelProps {
  data: Array<{ d: string; abierto: number; cerrado: number }>;
}

export const BurndownPanel = ({ data }: BurndownPanelProps) => {
  if (data.length < 2) return null;
  const W = 360;
  const H = 160;
  const PAD = { l: 24, r: 12, t: 14, b: 24 };
  const xs = data.map((_, i) => PAD.l + i * ((W - PAD.l - PAD.r) / (data.length - 1)));
  const max = Math.max(1, ...data.flatMap((d) => [d.abierto, d.cerrado]));
  const y = (v: number): number => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const lineA = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs[i]},${y(d.abierto)}`).join(' ');
  const lineB = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs[i]},${y(d.cerrado)}`).join(' ');
  const areaA = `${lineA} L${xs[xs.length - 1]},${H - PAD.b} L${xs[0]},${H - PAD.b} Z`;

  return (
    <Card padding={20}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            Burndown sprint
          </h2>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
            Abiertos vs. cerrados
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 11.5, fontWeight: 600 }}>
          <span style={{ color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#2563EB' }} /> Abiertos
          </span>
          <span style={{ color: '#22C55E', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22C55E' }} /> Cerrados
          </span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <defs>
          <linearGradient id="bd-a" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={PAD.t + t * (H - PAD.t - PAD.b)}
            y2={PAD.t + t * (H - PAD.t - PAD.b)}
            stroke="#F1F5F9"
            strokeWidth="1"
          />
        ))}
        <path d={areaA} fill="url(#bd-a)" />
        <path d={lineA} stroke="#2563EB" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <path d={lineB} stroke="#22C55E" strokeWidth="2" fill="none" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xs[i]} cy={y(d.abierto)} r="3" fill="#fff" stroke="#2563EB" strokeWidth="2" />
            <circle cx={xs[i]} cy={y(d.cerrado)} r="3" fill="#fff" stroke="#22C55E" strokeWidth="2" />
            <text
              x={xs[i]}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#94A3B8"
              fontWeight="600"
            >
              {d.d}
            </text>
          </g>
        ))}
      </svg>
    </Card>
  );
};
