import { Card } from '../shared/Card';
import { Icon } from '../shared/icons';
import { trackingTokens } from '../../styles/tokens';
import type { TrackingInsightDto } from '../../types/tracking';

interface InsightsPanelProps {
  insights: TrackingInsightDto[];
}

export const InsightsPanel = ({ insights }: InsightsPanelProps) => {
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
          Insights automáticos
        </h2>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11.5,
            fontWeight: 600,
            color: '#2563EB',
          }}
        >
          <Icon.spark width={12} height={12} /> Auto
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {insights.length === 0 && (
          <div style={{ fontSize: 13, color: '#94A3B8' }}>
            Datos insuficientes para generar insights. Sigue trabajando y vuelve más tarde.
          </div>
        )}
        {insights.map((it, i) => {
          const t = trackingTokens.status[it.tone];
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: '#F8FAFC',
                border: '1px solid #F1F5F9',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: t.bg,
                  color: t.fg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flex: 'none',
                }}
              >
                {it.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 500, lineHeight: 1.4 }}>
                  {it.text}
                </div>
                {it.trend && (
                  <div style={{ fontSize: 11, color: t.fg, fontWeight: 600, marginTop: 2 }}>
                    {it.trend}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
