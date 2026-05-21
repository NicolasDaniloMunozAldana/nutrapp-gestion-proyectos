import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/shared/icons';
import { Pill } from '../components/shared/Pill';
import { trackingTokens } from '../styles/tokens';
import { useSyncRefresh, useSyncStatus } from '../hooks/useTrackingSync';
import { useIsMobile } from '../hooks/useMediaQuery';
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
  const isMobile = useIsMobile();

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
      {!isMobile && (
        <aside
          style={{
            width: 88,
            background: trackingTokens.bg.sidebar,
            color: '#94A3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 0',
            borderRight: '1px solid #1E293B',
            position: 'sticky',
            top: 0,
            height: '100vh',
            flex: 'none',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <NavItem to="/" label="Dashboard" active={active === 'dashboard'} icon={Icon.grid} />
            <NavItem
              to={location.pathname.startsWith('/mi-vista') ? location.pathname : '/mi-vista'}
              label="Mi Vista"
              active={active === 'mi-vista'}
              icon={Icon.team}
            />
          </nav>
        </aside>
      )}

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            justifyContent: 'space-between',
            padding: isMobile ? '14px 16px 12px' : '24px 32px 16px',
            gap: isMobile ? 8 : 16,
            borderBottom: `1px solid ${trackingTokens.border.soft}`,
            background: 'rgba(248,250,252,0.92)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 5,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
                flexWrap: 'wrap',
              }}
            >
              <Pill tone="blue" dot>
                {sourceLabel[teamsSource] ?? teamsSource}
              </Pill>
              {status?.teams.count !== undefined && !isMobile && (
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
                fontSize: isMobile ? 18 : 28,
                fontWeight: 700,
                letterSpacing: isMobile ? -0.2 : -0.6,
                color: '#0F172A',
                lineHeight: 1.15,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <div
                style={{
                  marginTop: isMobile ? 4 : 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#64748B',
                  fontSize: isMobile ? 11.5 : 13,
                  flexWrap: 'wrap',
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
              gap: isMobile ? 6 : 10,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {rightSlot}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <button
                type="button"
                onClick={() => refresh.mutate()}
                disabled={refresh.isRefreshing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: isMobile ? 6 : 8,
                  padding: isMobile ? '8px 10px' : '9px 14px',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  background: refresh.isRefreshing ? '#EFF6FF' : '#FFFFFF',
                  color: refresh.isRefreshing ? '#1D4ED8' : '#0F172A',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: refresh.isRefreshing ? 'progress' : 'pointer',
                  opacity: refresh.isRefreshing ? 0.9 : 1,
                  minHeight: 40,
                  transition: 'background .15s ease, color .15s ease',
                }}
                title={
                  refresh.isRefreshing
                    ? 'Actualizando en segundo plano. Puedes seguir usando el dashboard.'
                    : 'Forzar resincronización con Jira'
                }
                aria-label={refresh.isRefreshing ? 'Actualizando' : 'Refrescar'}
                aria-busy={refresh.isRefreshing}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    width: 16,
                    height: 16,
                    animation: refresh.isRefreshing ? 'tracking-spin 1s linear infinite' : 'none',
                  }}
                >
                  <Icon.refresh width={16} height={16} />
                </span>
                {!isMobile && <span>{refresh.isRefreshing ? 'Actualizando…' : 'Refrescar'}</span>}
              </button>
              {refresh.rateLimited && (
                <span
                  style={{
                    fontSize: 11,
                    color: '#92400E',
                    background: '#FEF3C7',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                  role="status"
                >
                  Recién actualizado · espera un momento
                </span>
              )}
              {refresh.error && (
                <button
                  type="button"
                  onClick={refresh.dismissError}
                  style={{
                    fontSize: 11,
                    color: '#B91C1C',
                    background: '#FEE2E2',
                    border: 'none',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontWeight: 600,
                    cursor: 'pointer',
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${refresh.error} (click para ocultar)`}
                  role="alert"
                >
                  Falló el refresh · descartar
                </button>
              )}
            </div>
            {!isMobile && (active === 'dashboard' ? (
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
                  minHeight: 40,
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
                  minHeight: 40,
                }}
              >
                <Icon.grid width={16} height={16} /> Dashboard
              </button>
            ))}
          </div>
        </header>
        <div style={{ flex: 1, paddingBottom: isMobile ? 72 : 0 }}>{children}</div>
        {isMobile && (
          <nav
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 30,
              background: '#fff',
              borderTop: `1px solid ${trackingTokens.border.soft}`,
              boxShadow: '0 -8px 20px rgba(15,23,42,0.06)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              padding: '6px 6px max(6px, env(safe-area-inset-bottom))',
              gap: 4,
            }}
          >
            <MobileTab
              to="/"
              label="Dashboard"
              active={active === 'dashboard'}
              icon={Icon.grid}
            />
            <MobileTab
              to={location.pathname.startsWith('/mi-vista') ? location.pathname : '/mi-vista'}
              label="Mi Vista"
              active={active === 'mi-vista'}
              icon={Icon.team}
            />
          </nav>
        )}
      </main>
    </div>
  );
};

const MobileTab = ({
  to,
  label,
  active,
  icon: I,
}: {
  to: string;
  label: string;
  active?: boolean;
  icon: (p: { width?: number; height?: number }) => ReactNode;
}) => (
  <Link
    to={to}
    aria-label={label}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      padding: '8px 4px',
      borderRadius: 10,
      textDecoration: 'none',
      color: active ? '#2563EB' : '#64748B',
      background: active ? 'rgba(37,99,235,0.08)' : 'transparent',
      fontSize: 11,
      fontWeight: 600,
      minHeight: 48,
    }}
  >
    {I({ width: 20, height: 20 })}
    <span>{label}</span>
  </Link>
);
