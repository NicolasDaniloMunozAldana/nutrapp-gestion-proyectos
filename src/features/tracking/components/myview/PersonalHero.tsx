import type { ReactNode } from 'react';
import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Stars } from '../shared/Stars';
import { colorForUser } from '../../styles/tokens';
import type { TrackingMemberSummaryDto } from '../../types/tracking';

interface PersonalHeroProps {
  member: TrackingMemberSummaryDto;
  showRating: boolean;
}

interface HeroKpiProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: number;
  last?: boolean;
}

const HeroKPI = ({ icon, iconBg, label, value, last }: HeroKpiProps) => (
  <div
    style={{
      padding: '22px 18px',
      borderRight: last ? 'none' : '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 8,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{label}</div>
    </div>
    <div
      style={{
        fontSize: 42,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: -1.2,
        color: '#0F172A',
      }}
    >
      {value}
    </div>
  </div>
);

export const PersonalHero = ({ member, showRating }: PersonalHeroProps) => {
  const c = colorForUser(member.accountId || member.name);
  const ratingBlock = showRating && member.rating !== null;
  const cols = ratingBlock ? 'minmax(0, 3.4fr) minmax(280px, 1fr)' : '1fr';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px repeat(4, 1fr)',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #FDF2F8 0%, #FFFFFF 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '26px 16px',
              borderRight: '1px solid #F1F5F9',
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 999,
                  background: `radial-gradient(circle at 30% 30%, ${c} 0%, #1E293B 90%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 36,
                  fontWeight: 700,
                  boxShadow: '0 0 0 4px #fff, 0 0 0 6px rgba(244,114,182,0.35)',
                  letterSpacing: 0.5,
                  overflow: 'hidden',
                }}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  member.initials
                )}
              </div>
            </div>
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0F172A',
                  letterSpacing: -0.2,
                }}
              >
                {member.name}
              </div>
              <div
                style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}
              >
                {member.teamName ?? 'Sin equipo'}
              </div>
            </div>
          </div>
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.8" />
                <path d="M12 7v5l3 2" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
            iconBg="#EFF6FF"
            label="En curso"
            value={member.counts.enCurso}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 19c2-7 9-15 14-15-1 7-8 14-15 15M9 15c1.5.5 2.5 1.5 3 3"
                  stroke="#8B5CF6"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="14" cy="10" r="1.6" fill="#8B5CF6" />
              </svg>
            }
            iconBg="#F5F3FF"
            label="En despliegue"
            value={member.counts.despliegue}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4a8 8 0 1 0 0 16M8 12h8M12 8v8"
                  stroke="#FB923C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            }
            iconBg="#FFF7ED"
            label="Detenidos"
            value={member.counts.detenidos}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="13" rx="2" stroke="#475569" strokeWidth="1.6" />
                <path d="M4 10h16" stroke="#475569" strokeWidth="1.6" />
              </svg>
            }
            iconBg="#F1F5F9"
            label="Total"
            value={member.counts.total}
            last
          />
        </div>
      </Card>
      {ratingBlock && (
        <Card
          padding={20}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 60%)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>Calificación</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, lineHeight: 1 }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1.6, color: '#0F172A' }}>
              {(member.rating ?? 0).toFixed(1)}
            </span>
            <span style={{ fontSize: 18, color: '#94A3B8', fontWeight: 600 }}>/ 5</span>
          </div>
          <Stars value={member.rating ?? 0} size={16} showNumber={false} />
          <Pill tone="ok" dot>
            {(member.rating ?? 0) >= 4 ? 'Excelente' : (member.rating ?? 0) >= 3 ? 'Saludable' : 'Atención'}
          </Pill>
        </Card>
      )}
    </div>
  );
};
