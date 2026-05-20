import { useEffect, type CSSProperties } from 'react';
import { Pill } from '../shared/Pill';
import { Avatar } from '../shared/Avatar';
import { trackingTokens } from '../../styles/tokens';
import { useIssuesByEstado } from '../../hooks/useIssuesByEstado';
import { useIsMobile } from '../../hooks/useMediaQuery';
import type { TrackingFilters, TrackingIssueListItemDto } from '../../types/tracking';

interface StateDetailDrawerProps {
  estado: string | null;
  filters: TrackingFilters;
  onClose: () => void;
  onSelectMember?: (accountId: string) => void;
}

const ROW_BORDER = '1px solid #F1F5F9';

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontSize: 11.5,
  fontWeight: 600,
  color: '#64748B',
  background: '#F8FAFC',
  borderBottom: '1px solid #EEF2F7',
  borderTop: '1px solid #EEF2F7',
  whiteSpace: 'nowrap',
};

const tdStyle: CSSProperties = {
  padding: '12px 14px',
  borderBottom: ROW_BORDER,
  verticalAlign: 'middle',
};

const truncateCell: CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 0,
};

const alertaPill = (a: TrackingIssueListItemDto['alerta']) => {
  if (a === 'vencido') return <Pill tone="danger">Vencido</Pill>;
  if (a === 'deploy>10') return <Pill tone="danger" dot>+10 días</Pill>;
  if (a === 'riesgo') return <Pill tone="warn" dot>Riesgo</Pill>;
  return <span style={{ color: '#CBD5E1', fontSize: 12 }}>—</span>;
};

const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  } catch {
    return iso;
  }
};

const filterSummary = (filters: TrackingFilters): string => {
  const parts: string[] = [];
  if (filters.teamId) parts.push('equipo seleccionado');
  if (filters.from && filters.to) parts.push(`${filters.from} → ${filters.to}`);
  else if (filters.from) parts.push(`desde ${filters.from}`);
  else if (filters.to) parts.push(`hasta ${filters.to}`);
  if (filters.priorities.length) parts.push(filters.priorities.join(', '));
  return parts.length ? parts.join(' · ') : 'sin filtros adicionales';
};

const Body = ({
  estado,
  filters,
  onSelectMember,
}: {
  estado: string;
  filters: TrackingFilters;
  onSelectMember?: (accountId: string) => void;
}) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useIssuesByEstado(
    estado,
    filters,
  );
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div style={{ padding: 28, fontSize: 13.5, color: '#64748B' }}>
        Cargando incidencias…
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          margin: 20,
          padding: '14px 16px',
          borderRadius: 12,
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FCA5A5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span>Error: {(error as Error).message}</span>
        <button
          type="button"
          onClick={() => refetch()}
          style={{
            background: '#B91C1C',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: 28,
          fontSize: 13.5,
          color: '#64748B',
          textAlign: 'center',
        }}
      >
        No hay incidencias en estado <strong>{estado}</strong> con los filtros actuales.
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <div
          style={{
            padding: '10px 16px',
            fontSize: 12,
            color: '#94A3B8',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {data.length} ticket{data.length === 1 ? '' : 's'}
          {isFetching && <span style={{ color: '#2563EB' }}>· actualizando…</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.map((t) => (
            <div
              key={t.key}
              style={{
                padding: '12px 16px',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#2563EB',
                    fontWeight: 600,
                    fontFamily: 'ui-monospace,monospace',
                    textDecoration: 'none',
                    fontSize: 12.5,
                  }}
                >
                  {t.key}
                </a>
                {alertaPill(t.alerta)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#0F172A',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
                title={t.summary}
              >
                {t.summary}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {t.owner.accountId ? (
                  <button
                    type="button"
                    onClick={() => onSelectMember && onSelectMember(t.owner.accountId)}
                    title={t.owner.name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'transparent',
                      border: 'none',
                      cursor: onSelectMember ? 'pointer' : 'default',
                      padding: 0,
                      color: '#0F172A',
                      fontWeight: 500,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Avatar user={t.owner} size={22} hideStatus />
                    <span
                      style={{
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t.owner.name}
                    </span>
                  </button>
                ) : (
                  <span style={{ color: '#94A3B8', fontSize: 12 }}>Sin asignar</span>
                )}
                <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  {t.dias}d · vence {formatDate(t.duedate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          padding: '12px 20px',
          fontSize: 12,
          color: '#94A3B8',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {data.length} ticket{data.length === 1 ? '' : 's'}
        {isFetching && <span style={{ color: '#2563EB' }}>· actualizando…</span>}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: 13,
            tableLayout: 'fixed',
          }}
        >
          <colgroup>
            <col style={{ width: 88 }} />
            <col />
            <col style={{ width: 170 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 110 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>Jira</th>
              <th style={thStyle}>Resumen</th>
              <th style={thStyle}>Responsable</th>
              <th style={thStyle}>Días</th>
              <th style={thStyle}>Vence</th>
              <th style={thStyle}>Alerta</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr key={t.key}>
                <td style={{ ...tdStyle, ...truncateCell }}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#2563EB',
                      fontWeight: 600,
                      fontFamily: 'ui-monospace,monospace',
                      textDecoration: 'none',
                    }}
                  >
                    {t.key}
                  </a>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    ...truncateCell,
                    color: '#0F172A',
                    fontWeight: 500,
                  }}
                  title={t.summary}
                >
                  {t.summary}
                </td>
                <td style={{ ...tdStyle, ...truncateCell }}>
                  {t.owner.accountId ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectMember && onSelectMember(t.owner.accountId)
                      }
                      title={t.owner.name}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'transparent',
                        border: 'none',
                        cursor: onSelectMember ? 'pointer' : 'default',
                        padding: 0,
                        color: '#0F172A',
                        fontWeight: 500,
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <Avatar user={t.owner} size={22} hideStatus />
                      <span
                        style={{
                          fontSize: 12,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t.owner.name}
                      </span>
                    </button>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>Sin asignar</span>
                  )}
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>
                    {t.dias}d
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontSize: 12.5, color: '#475569' }}>
                    {formatDate(t.duedate)}
                  </span>
                </td>
                <td style={tdStyle}>{alertaPill(t.alerta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const StateDetailDrawer = ({
  estado,
  filters,
  onClose,
  onSelectMember,
}: StateDetailDrawerProps) => {
  const open = !!estado;

  // Close on Esc — preserves the dashboard's filters since they live in
  // DashboardPage state and aren't touched by the drawer at all.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.35)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity .18s ease',
          zIndex: 50,
        }}
        aria-hidden
      />
      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={estado ? `Incidencias en ${estado}` : 'Detalle de estado'}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'min(720px, 96vw)',
          background: '#fff',
          boxShadow: '-12px 0 30px rgba(15,23,42,0.18)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .22s ease',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            padding: '20px 22px 14px',
            borderBottom: `1px solid ${trackingTokens.border.soft}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              Detalle de estado
            </div>
            <h2
              style={{
                margin: '4px 0 0',
                fontSize: 20,
                fontWeight: 700,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {estado ?? ''}
            </h2>
            <div style={{ marginTop: 4, fontSize: 12, color: '#94A3B8' }}>
              Filtros: {filterSummary(filters)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              flex: 'none',
              width: 32,
              height: 32,
              borderRadius: 10,
              border: '1px solid #E2E8F0',
              background: '#fff',
              color: '#475569',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>
        <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
          {estado && (
            <Body estado={estado} filters={filters} onSelectMember={onSelectMember} />
          )}
        </div>
      </aside>
    </>
  );
};
