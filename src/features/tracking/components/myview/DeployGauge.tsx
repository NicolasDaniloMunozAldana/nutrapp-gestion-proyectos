import { Card } from '../shared/Card';

interface DeployGaugeProps {
  avgDays: number;
}

export const DeployGauge = ({ avgDays }: DeployGaugeProps) => {
  const max = 14;
  const pct = Math.min(1, avgDays / max);
  const W = 240;
  const H = 130;
  const cx = W / 2;
  const cy = H - 8;
  const r = 84;
  const arcPath = (start: number, end: number): string => {
    const sx = cx + r * Math.cos(Math.PI - start * Math.PI);
    const sy = cy - r * Math.sin(Math.PI - start * Math.PI);
    const ex = cx + r * Math.cos(Math.PI - end * Math.PI);
    const ey = cy - r * Math.sin(Math.PI - end * Math.PI);
    return `M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}`;
  };
  const angle = Math.PI - pct * Math.PI;
  const nx = cx + (r - 14) * Math.cos(angle);
  const ny = cy - (r - 14) * Math.sin(angle);
  return (
    <Card padding={20}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Tiempo en despliegue</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 6 }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flex: 'none' }}>
          <path d={arcPath(0, 0.5)} stroke="#22C55E" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d={arcPath(0.5, 0.78)} stroke="#F59E0B" strokeWidth="14" fill="none" />
          <path d={arcPath(0.78, 1)} stroke="#EF4444" strokeWidth="14" fill="none" strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="6" fill="#0F172A" />
        </svg>
        <div style={{ flex: 1, paddingBottom: 4, borderLeft: '1px solid #F1F5F9', paddingLeft: 14 }}>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: -14 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: -1 }}>
          {avgDays.toFixed(1)}
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginTop: -2 }}>
          días promedio
        </div>
      </div>
    </Card>
  );
};
