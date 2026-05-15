import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Avatar } from '../shared/Avatar';
import { trackingTokens } from '../../styles/tokens';
import type { TrackingPriorityTicketDto } from '../../types/tracking';

interface PriorityPanelProps {
  tickets: TrackingPriorityTicketDto[];
}

export const PriorityPanel = ({ tickets }: PriorityPanelProps) => {
  const urgentCount = tickets.filter(
    (t) => t.reason.tone === 'danger' || t.reason.tone === 'deploy',
  ).length;
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
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            Prioridad de atención
          </h2>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
            Ordenado automáticamente
          </div>
        </div>
        <Pill tone="danger" dot>
          {urgentCount} urgentes
        </Pill>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tickets.length === 0 && (
          <div style={{ fontSize: 13, color: '#94A3B8' }}>Sin tickets urgentes hoy.</div>
        )}
        {tickets.map((t, i) => {
          const toneKey = t.reason.tone === 'deploy' ? 'deploy' : t.reason.tone === 'warn' ? 'warn' : t.reason.tone === 'danger' ? 'danger' : 'neutral';
          const tone = trackingTokens.status[toneKey];
          return (
            <div
              key={t.key}
              style={{
                display: 'grid',
                gridTemplateColumns: '26px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid #F1F5F9',
                background: i === 0 ? 'linear-gradient(90deg,#FEF2F2 0%, #FFFFFF 60%)' : '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  background: tone.bg,
                  color: tone.fg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                {i + 1}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: 'ui-monospace,monospace',
                      fontSize: 11.5,
                      color: '#2563EB',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {t.key}
                  </a>
                  <Pill tone={toneKey} dot style={{ fontSize: 10.5, padding: '2px 8px' }}>
                    {t.reason.label}
                  </Pill>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#0F172A',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={t.summary}
                >
                  {t.summary}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: tone.fg }}>{t.dias}d</span>
                {t.owner.accountId && <Avatar user={t.owner} size={24} hideStatus />}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
