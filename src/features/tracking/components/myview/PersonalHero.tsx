import { useState, type ReactNode } from 'react';
import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Stars } from '../shared/Stars';
import { AverageCard } from './AverageCard';
import { localAvatarUrl } from '../shared/Avatar';
import { colorForUser } from '../../styles/tokens';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { normalizePersonName, personInitials } from '../../utils/names';
import type { TrackingMemberSummaryDto, WorkAverageDto } from '../../types/tracking';

interface PersonalHeroProps {
  member: TrackingMemberSummaryDto;
  showRating: boolean;
  work?: WorkAverageDto;
  // Opens the per-estado drawer for this developer (Mi Vista). When omitted the
  // hero cards are static (no click affordance).
  onSelectEstado?: (estado: string) => void;
}

interface HeroKpiProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: number;
  last?: boolean;
  onClick?: () => void;
}

const HeroKPI = ({ icon, iconBg, label, value, last, onClick }: HeroKpiProps) => (
  <div
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={
      onClick
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }
        : undefined
    }
    title={onClick ? `Ver incidencias en "${label}"` : undefined}
    style={{
      padding: '22px 18px',
      borderRight: last ? 'none' : '1px solid #F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 8,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background .15s ease',
    }}
    onMouseEnter={
      onClick ? (e) => (e.currentTarget.style.background = '#F8FAFC') : undefined
    }
    onMouseLeave={
      onClick ? (e) => (e.currentTarget.style.background = 'transparent') : undefined
    }
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

export const PersonalHero = ({
  member,
  showRating,
  work,
  onSelectEstado,
}: PersonalHeroProps) => {
  const c = colorForUser(member.accountId || member.name);
  const open = (estado: string) =>
    onSelectEstado ? () => onSelectEstado(estado) : undefined;
  const ratingBlock = showRating && member.rating !== null;
  const hasWork = !!work;
  // Right column appears when there is a rating block and/or the work average.
  const showRight = ratingBlock || hasWork;
  const [avatarFailed, setAvatarFailed] = useState(false);
  const heroAvatarSrc = localAvatarUrl(member.accountId);
  const showAvatarImg = !!heroAvatarSrc && !avatarFailed;
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        display: 'grid',
        // Desktop: Estados (información principal) ocupa el 70% y el panel
        // secundario (Calificación + Promedio) el 30%. En mobile se apila
        // verticalmente para no romper el responsive.
        gridTemplateColumns:
          showRight && !isMobile
            ? 'minmax(0, 7fr) minmax(0, 3fr)'
            : '1fr',
        gap: 16,
      }}
    >
      <Card padding={0} style={{ overflow: 'hidden', minWidth: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'minmax(200px, 240px) repeat(auto-fit, minmax(140px, 1fr))',
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
                {showAvatarImg ? (
                  <img
                    src={heroAvatarSrc as string}
                    alt={normalizePersonName(member.name)}
                    onError={() => setAvatarFailed(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  personInitials(member.name) || member.initials
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
                {normalizePersonName(member.name)}
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
                <circle cx="12" cy="12" r="9" stroke="#64748B" strokeWidth="1.6" />
                <path d="M12 7v5l3 2" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            }
            iconBg="#F1F5F9"
            label="Por hacer"
            value={member.counts.porHacer ?? 0}
            onClick={open('Por hacer')}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#2563EB" strokeWidth="1.8" />
                <path d="M12 7v5l3 2" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
            iconBg="#EFF6FF"
            label="En curso"
            value={member.counts.enCurso ?? 0}
            onClick={open('En curso')}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 12 5l7 7-7 7-7-7z" stroke="#22D3EE" strokeWidth="1.6" />
              </svg>
            }
            iconBg="#ECFEFF"
            label="Despliegue DEV"
            value={member.counts.despliegueDev ?? 0}
            onClick={open('Despliegue a DEV')}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 12 5l7 7-7 7-7-7z" stroke="#8B5CF6" strokeWidth="1.6" />
              </svg>
            }
            iconBg="#F5F3FF"
            label="Despliegue QA"
            value={member.counts.despliegueQa ?? 0}
            onClick={open('Despliegue a QA')}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 12 5l7 7-7 7-7-7z" stroke="#EC4899" strokeWidth="1.6" />
              </svg>
            }
            iconBg="#FDF2F8"
            label="Despliegue PROD"
            value={member.counts.despliegueProd ?? 0}
            onClick={open('Despliegue a PROD')}
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
            value={member.counts.detenidos ?? 0}
            onClick={open('Detenido')}
          />
          <HeroKPI
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4z"
                  stroke="#D97706"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M9 12l2 2 4-4" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            iconBg="#FFFBEB"
            label="Esperando aprob."
            value={member.counts.esperandoAprobacion ?? 0}
            onClick={open('Esperando aprobación')}
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
            onClick={open('Total')}
            last
          />
        </div>
      </Card>
      {showRight && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
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
          {/* "Promedio" — sits directly below the rating block. */}
          {hasWork && <AverageCard work={work!} />}
        </div>
      )}
    </div>
  );
};
