import { Card } from '../shared/Card';

interface CommentsDonutProps {
  data: {
    expectedTotal: number;
    actualTotal: number;
    hoy: number;
    anteriores: number;
    pendientes: number;
  };
}

export const CommentsDonut = ({ data }: CommentsDonutProps) => {
  const total = Math.max(1, data.expectedTotal);
  const segs = [
    { v: data.hoy, color: '#22C55E', label: 'Hoy' },
    { v: data.anteriores, color: '#0EA5E9', label: 'Anteriores en periodo' },
    { v: data.pendientes, color: '#EF4444', label: 'Sin update' },
  ];
  const R = 50;
  const C = 64;
  let acc = 0;
  const sumSegs = data.hoy + data.anteriores + data.pendientes || 1;
  const coverage = data.expectedTotal === 0
    ? 100
    : Math.min(100, Math.round((data.actualTotal / data.expectedTotal) * 100));

  return (
    <Card padding={20}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
        Comentarios diarios{' '}
        <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: 12 }}>
          (esperado vs registrado)
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
        <svg width={C * 2} height={C * 2} viewBox={`0 0 ${C * 2} ${C * 2}`}>
          <circle cx={C} cy={C} r={R} stroke="#F1F5F9" strokeWidth="14" fill="none" />
          {segs.map((s, i) => {
            if (s.v <= 0) return null;
            const frac = s.v / sumSegs;
            const len = frac * 2 * Math.PI * R;
            const off = -acc * 2 * Math.PI * R;
            const el = (
              <circle
                key={i}
                cx={C}
                cy={C}
                r={R}
                stroke={s.color}
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${len} ${2 * Math.PI * R - len}`}
                strokeDashoffset={off}
                transform={`rotate(-90 ${C} ${C})`}
                strokeLinecap="butt"
              />
            );
            acc += frac;
            return el;
          })}
          <text x={C} y={C - 2} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0F172A">
            {data.actualTotal}/{data.expectedTotal}
          </text>
          <text x={C} y={C + 14} textAnchor="middle" fontSize="9" fontWeight="600" fill="#94A3B8">
            {coverage}%
          </text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segs.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12.5,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#0F172A',
                  fontWeight: 500,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, background: s.color }} />
                {s.label}
              </span>
              <span style={{ color: '#475569', fontWeight: 600 }}>
                {s.v}
                {data.expectedTotal > 0 && (
                  <span style={{ color: '#94A3B8', fontWeight: 500, marginLeft: 4 }}>
                    ({Math.round((100 * s.v) / total)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 11,
          color: '#94A3B8',
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        Total esperado = días hábiles que cada incidencia "En proceso" ha estado activa
        (1 comentario / día / incidencia).
      </div>
    </Card>
  );
};
