import { Card } from '../shared/Card';

interface MetricStripProps {
  metrics: {
    cumplimientoSlaPct: number;
    comentariosHoyPct: number;
    despliegueAvgDias: number;
    detenidosAvgDias: number;
    cicloAvgDias: number;
  };
}

const MiniGauge = ({ pct, color = '#22C55E' }: { pct: number; color?: string }) => {
  const R = 18;
  const C = 22;
  const circ = 2 * Math.PI * R;
  const off = circ * (1 - pct / 100);
  return (
    <svg width={C * 2} height={C * 2} viewBox={`0 0 ${C * 2} ${C * 2}`} style={{ flex: 'none' }}>
      <circle cx={C} cy={C} r={R} stroke="#F1F5F9" strokeWidth="5" fill="none" />
      <circle
        cx={C}
        cy={C}
        r={R}
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform={`rotate(-90 ${C} ${C})`}
      />
    </svg>
  );
};

export const MetricStrip = ({ metrics }: MetricStripProps) => {
  const items = [
    {
      label: 'Cumplimiento SLA',
      value: `${metrics.cumplimientoSlaPct}%`,
      gauge: metrics.cumplimientoSlaPct,
      color: metrics.cumplimientoSlaPct >= 80 ? '#22C55E' : metrics.cumplimientoSlaPct >= 60 ? '#F59E0B' : '#EF4444',
    },
    {
      label: 'Comentarios diarios',
      value: `${metrics.comentariosHoyPct}%`,
      gauge: metrics.comentariosHoyPct,
      color: metrics.comentariosHoyPct >= 70 ? '#22C55E' : metrics.comentariosHoyPct >= 40 ? '#F59E0B' : '#EF4444',
    },
    {
      label: 'Tickets en despliegue',
      sub: `Promedio ${metrics.despliegueAvgDias} días`,
      dot: metrics.despliegueAvgDias <= 7 ? '#22C55E' : metrics.despliegueAvgDias <= 10 ? '#F59E0B' : '#EF4444',
    },
    {
      label: 'Detenidos',
      sub: `Promedio ${metrics.detenidosAvgDias} días`,
      dot: metrics.detenidosAvgDias <= 5 ? '#22C55E' : '#F59E0B',
    },
    {
      label: 'Ciclo promedio',
      sub: `${metrics.cicloAvgDias} días`,
      dot: metrics.cicloAvgDias <= 7 ? '#22C55E' : '#F59E0B',
    },
  ];
  return (
    <Card padding={0}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              padding: '16px 20px',
              borderRight: i === items.length - 1 ? 'none' : '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>{it.label}</div>
              {it.sub && (
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
                  {it.sub}
                </div>
              )}
              {it.value && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{it.value}</span>
                </div>
              )}
            </div>
            {it.gauge != null && <MiniGauge pct={it.gauge} color={it.color} />}
            {it.dot && (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: it.dot,
                  flex: 'none',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
