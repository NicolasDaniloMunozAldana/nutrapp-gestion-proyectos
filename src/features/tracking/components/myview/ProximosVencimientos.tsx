import { Card } from '../shared/Card';
import type { TrackingPriorityTicketDto } from '../../types/tracking';

interface ProximosVencimientosProps {
  upcoming: TrackingPriorityTicketDto[];
}

export const ProximosVencimientos = ({ upcoming }: ProximosVencimientosProps) => {
  if (upcoming.length === 0) return null;
  return (
    <Card padding={20} style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
          Próximos vencimientos (SLA)
        </h2>
        <span style={{ fontSize: 12.5, color: '#2563EB', fontWeight: 600 }}>
          {upcoming.length} riesgo{upcoming.length === 1 ? '' : 's'}
        </span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
        }}
      >
        {upcoming.map((t) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dueMs = t.duedate ? new Date(t.duedate).getTime() : NaN;
          const hasDue = Number.isFinite(dueMs);
          const daysToDue = hasDue
            ? Math.round((dueMs - today.getTime()) / (24 * 60 * 60 * 1000))
            : null;
          const vencido = hasDue && (daysToDue ?? 0) < 0;
          const sinFecha = !hasDue;
          const badgeBg = vencido ? '#FEE2E2' : sinFecha ? '#F1F5F9' : '#FDE68A';
          const badgeFg = vencido ? '#B91C1C' : sinFecha ? '#475569' : '#92400E';
          const badgeText = vencido
            ? 'Vencido'
            : sinFecha
              ? 'Sin fecha de vencimiento'
              : (daysToDue ?? 0) === 0
                ? 'Vence hoy'
                : `Vence en ${daysToDue}d`;
          return (
            <a
              key={t.key}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'grid',
                gridTemplateColumns: '36px minmax(0, 1fr)',
                gridTemplateRows: 'auto auto',
                rowGap: 8,
                columnGap: 12,
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 14,
                background: '#FFFBEB',
                border: '1px solid #FEF3C7',
                textDecoration: 'none',
                overflow: 'hidden',
                minWidth: 0,
                maxWidth: '100%',
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
                  gridRow: '1 / span 2',
                }}
              >
                ◷
              </div>
              <div
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0F172A',
                    fontFamily: 'ui-monospace,monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t.key}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#475569',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    lineHeight: 1.35,
                  }}
                  title={t.summary}
                >
                  {t.summary}
                </div>
              </div>
              <div
                style={{
                  gridColumn: '2 / 3',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: badgeBg,
                    color: badgeFg,
                    fontSize: 11.5,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    maxWidth: '100%',
                  }}
                >
                  {badgeText}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </Card>
  );
};
