import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/shared/icons';
import { Pill } from '../components/shared/Pill';
import { trackingTokens } from '../styles/tokens';
import { useSyncRefresh, useSyncStatus } from '../hooks/useTrackingSync';
import { SkeletonStyleTag } from '../components/shared/Skeleton';

interface TrackingShellProps {
  active: 'dashboard' | 'mi-vista';
  children: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  rightSlot?: ReactNode;
}

const NavItem = ({
  to,
  label,
  active,
  icon: I,
}: {
  to: string;
  label: string;
  active: boolean;
  icon: (p: { width?: number; height?: number }) => ReactNode;
}) => (
  <Link
    to={to}
    style={{
      position: 'relative',
      width: 56,
      height: 56,
      borderRadius: 14,
      background: active ? 'rgba(37,99,235,0.18)' : 'transparent',
      color: active ? '#93C5FD' : '#94A3B8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      transition: 'background .15s ease, color .15s ease',
    }}
    aria-label={label}
    title={label}
  >
    {active && (
      <span
        style={{
          position: 'absolute',
          left: -16,
          top: 14,
          bottom: 14,
          width: 3,
          borderRadius: 2,
          background: '#2563EB',
        }}
      />
    )}
    {I({ width: 22, height: 22 })}
  </Link>
);

const sourceLabel: Record<string, string> = {
  'atlassian-api': 'Atlassian Teams',
  'team-field': 'Team field (Jira)',
  fallback: 'Manual',
  unavailable: 'No disponible',
};

export const TrackingShell = ({
  active,
  children,
  title,
  subtitle,
  rightSlot,
}: TrackingShellProps) => {
  const { data: status } = useSyncStatus();
  const refresh = useSyncRefresh();
  const location = useLocation();
  const navigate = useNavigate();

  const lastSyncText = status?.lastSyncAt
    ? new Date(status.lastSyncAt).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const teamsSource = status?.teams.source ?? 'unavailable';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: trackingTokens.bg.app,
        fontFamily: trackingTokens.font,
        color: trackingTokens.text.base,
      }}
    >
      <SkeletonStyleTag />
      <aside
        style={{
          width: 88,
          background: trackingTokens.bg.sidebar,
          color: '#94A3B8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 0',
          borderRight: '1px solid #1E293B',
          position: 'sticky',
          top: 0,
          height: '100vh',
          flex: 'none',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 6px 20px rgba(37,99,235,0.45), inset 0 0 0 1px rgba(255,255,255,0.15)',
            marginBottom: 24,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="6" stroke="#fff" strokeOpacity="0.65" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2.5" fill="#fff" />
          </svg>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <NavItem to="/" label="Dashboard" active={active === 'dashboard'} icon={Icon.grid} />
          <NavItem
            to={location.pathname.startsWith('/mi-vista') ? location.pathname : '/mi-vista'}
            label="Mi Vista"
            active={active === 'mi-vista'}
            icon={Icon.team}
          />
        </nav>
        <Link
          to="/teamboard"
          aria-label="Ir al TeamBoard"
          title="TeamBoard (Kanban)"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          TB
        </Link>
      </aside>

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '28px 32px 20px',
            gap: 24,
            borderBottom: `1px solid ${trackingTokens.border.soft}`,
            background: 'rgba(248,250,252,0.85)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Pill tone="blue" dot>
                {sourceLabel[teamsSource] ?? teamsSource}
              </Pill>
              {status?.teams.count !== undefined && (
                <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 500 }}>
                  · {status.teams.count} equipos
                </span>
              )}
              {status?.stale && (
                <Pill tone="warn" dot>
                  Stale
                </Pill>
              )}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: -0.6,
                color: '#0F172A',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#64748B',
                  fontSize: 13,
                }}
              >
                {subtitle}
                <span>·</span>
                <span>Actualizado {lastSyncText}</span>
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {rightSlot}
            <button
              type="button"
              onClick={() => refresh.mutate()}
              disabled={refresh.isPending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 14px',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: 13,
                fontWeight: 600,
                cursor: refresh.isPending ? 'wait' : 'pointer',
                opacity: refresh.isPending ? 0.7 : 1,
              }}
              title="Forzar resincronización con Jira"
            >
              <Icon.refresh width={16} height={16} />
              Refrescar
            </button>
            {active === 'dashboard' ? (
              <button
                type="button"
                onClick={() => navigate('/mi-vista')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 14px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#2563EB',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.30)',
                }}
              >
                <Icon.team width={16} height={16} /> Mi Vista
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 14px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#2563EB',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.30)',
                }}
              >
                <Icon.grid width={16} height={16} /> Dashboard
              </button>
            )}
          </div>
        </header>
        <div style={{ flex: 1 }}>{children}</div>
      </main>
    </div>
  );
};
