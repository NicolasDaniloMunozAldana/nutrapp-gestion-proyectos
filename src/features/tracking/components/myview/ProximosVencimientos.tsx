import { Card } from '../shared/Card';
import type { TrackingPriorityTicketDto } from '../../types/tracking';

interface ProximosVencimientosProps {
  upcoming: TrackingPriorityTicketDto[];
}

export const ProximosVencimientos = ({ upcoming }: ProximosVencimientosProps) => {
  if (upcoming.length === 0) return null;
  return (
    <Card padding={20}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
          Próximos vencimientos (SLA)
        </h2>
        <span style={{ fontSize: 12.5, color: '#2563EB', fontWeight: 600 }}>
          {upcoming.length} riesgos
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(3, upcoming.length)}, 1fr)`,
          gap: 12,
        }}
      >
        {upcoming.map((t) => {
          const remaining = Math.max(0, t.sla - t.dias);
          return (
            <a
              key={t.key}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 14,
                background: '#FFFBEB',
                border: '1px solid #FEF3C7',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#FDE68A',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  flex: 'none',
                }}
              >
                ◷
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0F172A',
                    fontFamily: 'ui-monospace,monospace',
                  }}
                >
                  {t.key}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#475569',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t.summary}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#B45309',
                  whiteSpace: 'nowrap',
                }}
              >
                {remaining > 0 ? `Vence en ${remaining}d` : 'Vencido'}
              </div>
            </a>
          );
        })}
      </div>
    </Card>
  );
};
