import { Card } from '../shared/Card';

interface CommentsCoverageCardProps {
  expected: number;
  actual: number;
  coveragePct: number;
}

export const CommentsCoverageCard = ({
  expected,
  actual,
  coveragePct,
}: CommentsCoverageCardProps) => {
  const color = coveragePct >= 80 ? '#22C55E' : coveragePct >= 60 ? '#F59E0B' : '#EF4444';
  const tone = coveragePct >= 80 ? 'OK' : coveragePct >= 60 ? 'Atención' : 'Crítico';
  return (
    <Card padding={20}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
        Comentarios esperados vs actuales
      </div>
      <div style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500, marginTop: 4 }}>
        Estimado: 1 comentario por día (incl. hoy) desde la Start date en "En proceso"
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginTop: 16,
        }}
      >
        <div>
          <div
            style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, color: '#0F172A', lineHeight: 1 }}
          >
            {actual}
            <span style={{ color: '#94A3B8', fontSize: 18, fontWeight: 600 }}>
              {' '}
              / {expected}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, marginTop: 4 }}>
            comentarios registrados
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
            {coveragePct}%
          </div>
          <div style={{ fontSize: 11.5, color, fontWeight: 700, marginTop: 4 }}>{tone}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          height: 8,
          background: '#F1F5F9',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${coveragePct}%`,
            height: '100%',
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
    </Card>
  );
};
