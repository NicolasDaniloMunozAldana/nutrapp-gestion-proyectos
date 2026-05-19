import { useState, type ReactNode } from 'react';
import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Sparkline } from '../shared/Sparkline';
import { Stars } from '../shared/Stars';
import { Icon } from '../shared/icons';
import { localAvatarUrl } from '../shared/Avatar';
import type { TrackingKpisDto, TrackingMemberSummaryDto } from '../../types/tracking';

const MiniAvatar = ({ member }: { member: TrackingMemberSummaryDto }) => {
  const [failed, setFailed] = useState(false);
  const src = localAvatarUrl(member.accountId);
  if (!src || failed) return <>{member.initials}</>;
  return (
    <img
      src={src}
      alt={member.name}
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

interface KpiRowProps {
  kpis: TrackingKpisDto;
  membersPreview: TrackingMemberSummaryDto[];
  showRating: boolean;
}

interface KpiProps {
  label: string;
  value: number | string;
  suffix?: string;
  delta?: number;
  deltaLabel?: string;
  trend?: number[];
  trendColor?: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  footer?: ReactNode;
}

const KPI = ({
  label,
  value,
  suffix,
  delta,
  deltaLabel,
  trend,
  trendColor = '#2563EB',
  icon,
  iconBg,
  iconColor,
  footer,
}: KpiProps) => (
  <Card padding={20} hoverable style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 168 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>{label}</div>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, lineHeight: 1 }}>
      <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1.2, color: '#0F172A' }}>{value}</span>
      {suffix && <span style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>{suffix}</span>}
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {delta != null && delta !== 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 12,
              fontWeight: 700,
              color: delta > 0 ? '#15803D' : '#B91C1C',
            }}
          >
            {delta > 0 ? <Icon.arrowUp width={11} height={11} /> : <Icon.arrowDn width={11} height={11} />}
            {Math.abs(delta)}
          </span>
        )}
        {deltaLabel && (
          <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>{deltaLabel}</span>
        )}
      </div>
      {trend && trend.length > 0 && <Sparkline data={trend} width={84} height={28} color={trendColor} />}
    </div>
    {footer && <div style={{ marginTop: 4 }}>{footer}</div>}
  </Card>
);

export const KpiRow = ({ kpis, membersPreview, showRating }: KpiRowProps) => {
  const previewCap = 6;
  void showRating;
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      }}
    >
      <KPI
        label="Personas activas"
        value={kpis.personas}
        suffix="personas"
        icon={<Icon.team width={18} height={18} />}
        iconBg="#EFF6FF"
        iconColor="#2563EB"
        deltaLabel={`${membersPreview.length} en equipos`}
        footer={
          <div style={{ display: 'flex', marginLeft: -2 }}>
            {membersPreview.slice(0, previewCap).map((m, i) => (
              <div
                key={m.accountId}
                title={m.name}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px #fff',
                  marginLeft: i === 0 ? 0 : -8,
                  overflow: 'hidden',
                }}
              >
                <MiniAvatar member={m} />
              </div>
            ))}
            {membersPreview.length > previewCap && (
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 2px #fff',
                  marginLeft: -8,
                }}
              >
                +{membersPreview.length - previewCap}
              </div>
            )}
          </div>
        }
      />
      <KPI
        label="En curso"
        value={kpis.enCurso}
        delta={kpis.deltas.enCurso}
        deltaLabel="vs ayer"
        icon={<Icon.spark width={18} height={18} />}
        iconBg="#EFF6FF"
        iconColor="#2563EB"
        trend={kpis.trends.enCurso}
        trendColor="#2563EB"
      />
      <KPI
        label="En despliegue"
        value={kpis.despliegue}
        delta={kpis.deltas.despliegue}
        deltaLabel="vs ayer"
        icon={
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path d="M5 12 12 5l7 7-7 7-7-7z" stroke="#8B5CF6" strokeWidth="1.6" />
          </svg>
        }
        iconBg="#F5F3FF"
        iconColor="#8B5CF6"
        trend={kpis.trends.despliegue}
        trendColor="#8B5CF6"
        footer={
          kpis.despliegueOver10 > 0 ? (
            <Pill tone="danger" dot>
              {kpis.despliegueOver10} sobre 10 días
            </Pill>
          ) : null
        }
      />
      <KPI
        label="Detenidos"
        value={kpis.detenidos}
        delta={kpis.deltas.detenidos}
        deltaLabel="vs ayer"
        icon={
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <rect x="6" y="6" width="5" height="12" rx="1" fill="#EF4444" />
            <rect x="13" y="6" width="5" height="12" rx="1" fill="#EF4444" />
          </svg>
        }
        iconBg="#FEF2F2"
        iconColor="#EF4444"
        trend={kpis.trends.detenidos}
        trendColor="#EF4444"
      />
      <KPI
        label="Completados"
        value={kpis.completados}
        delta={kpis.deltas.completados}
        deltaLabel="en rango"
        icon={
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <path d="M5 12l4 4L19 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        iconBg="#DCFCE7"
        iconColor="#22C55E"
        trend={kpis.trends.completados}
        trendColor="#22C55E"
      />
      {showRating && kpis.ratingAvg !== null && (
        <KPI
          label="Calificación"
          value={kpis.ratingAvg.toFixed(1)}
          suffix="/ 5"
          icon={
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5l3 6.1 6.7 1-4.85 4.7L18 21l-6-3.2L6 21l1.15-6.7L2.3 9.6 9 8.6 12 2.5z"
                fill="#F59E0B"
              />
            </svg>
          }
          iconBg="#FFFBEB"
          iconColor="#F59E0B"
          trend={kpis.trends.rating}
          trendColor="#F59E0B"
          footer={<Stars value={kpis.ratingAvg} size={13} showNumber={false} />}
        />
      )}
    </div>
  );
};
