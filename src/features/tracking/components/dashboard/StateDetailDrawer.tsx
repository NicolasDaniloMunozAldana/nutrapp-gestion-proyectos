import { useEffect, type CSSProperties } from 'react';
import { Pill } from '../shared/Pill';
import { Avatar } from '../shared/Avatar';
import { trackingTokens } from '../../styles/tokens';
import { useIssuesByEstado } from '../../hooks/useIssuesByEstado';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { normalizePersonName } from '../../utils/names';
import { estadoDisplayLabel } from '../shared/estadoLabel';
import type { TrackingFilters, TrackingIssueListItemDto } from '../../types/tracking';

// Sentinel estado meaning "every state" — opened from Mi Vista's "Total" card.
const ALL_ESTADOS = 'Total';

interface StateDetailDrawerProps {
  estado: string | null;
  filters: TrackingFilters;
  onClose: () => void;
  onSelectMember?: (accountId: string) => void;
  // When set, the drawer is scoped to a single developer (Mi Vista): only that
  // assignee's issues for the estado are listed and the redundant "Responsable"
  // column is hidden. `memberName` only feeds the header context label.
  accountId?: string | null;
  memberName?: string;
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

const estadoPill = (t: TrackingIssueListItemDto) => {
  const { estado, teamId, teamName } = t;
  if (estado === 'Por hacer') return <Pill tone="neutral" dot>Por hacer</Pill>;
  if (estado === 'En curso') return <Pill tone="blue" dot>En curso</Pill>;
  if (
    estado === 'Despliegue a DEV' ||
    estado === 'Despliegue a QA' ||
    estado === 'Despliegue a PROD'
  )
    return <Pill tone="deploy" dot>{estadoDisplayLabel(estado, teamId, teamName)}</Pill>;
  if (estado === 'Detenido') return <Pill tone="danger" dot>Detenido</Pill>;
  if (estado === 'Esperando aprobación') return <Pill tone="warn" dot>Esperando aprob.</Pill>;
  if (estado === 'Completado') return <Pill tone="ok" dot>Completado</Pill>;
  return <Pill tone="neutral" dot>{estado}</Pill>;
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
  accountId,
}: {
  estado: string;
  filters: TrackingFilters;
  onSelectMember?: (accountId: string) => void;
  accountId?: string | null;
}) => {
  const { data, isLoading, isError, error, refetch, isFetching } = useIssuesByEstado(
    estado,
    filters,
    accountId,
  );
  const isMobile = useIsMobile();
  // Scoped to a single developer → the responsable is constant, so drop the column.
  const hideOwner = !!accountId;
  // "Total" lists every state at once, so surface an Estado column to tell them apart.
  const showEstado = estado === ALL_ESTADOS;

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
        {showEstado ? (
          <>No hay incidencias con los filtros actuales.</>
        ) : (
          <>
            No hay incidencias en estado <strong>{estado}</strong> con los filtros actuales.
          </>
        )}
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
                {hideOwner ? (
                  showEstado ? (
                    <span style={{ flex: 1, minWidth: 0 }}>{estadoPill(t)}</span>
                  ) : (
                    <span style={{ flex: 1 }} />
                  )
                ) : t.owner.accountId ? (
                  <button
                    type="button"
                    onClick={() => onSelectMember && onSelectMember(t.owner.accountId)}
                    title={normalizePersonName(t.owner.name)}
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
                      {normalizePersonName(t.owner.name)}
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
            {!hideOwner && <col style={{ width: 170 }} />}
            {showEstado && <col style={{ width: 132 }} />}
            <col style={{ width: 90 }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 110 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>Jira</th>
              <th style={thStyle}>Resumen</th>
              {!hideOwner && <th style={thStyle}>Responsable</th>}
              {showEstado && <th style={thStyle}>Estado</th>}
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
                {!hideOwner && (
                <td style={{ ...tdStyle, ...truncateCell }}>
                  {t.owner.accountId ? (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectMember && onSelectMember(t.owner.accountId)
                      }
                      title={normalizePersonName(t.owner.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        minWidth: 0,
                        background: 'transparent',
                        border: 'none',
                        cursor: onSelectMember ? 'pointer' : 'default',
                        padding: 0,
                        margin: 0,
                        color: '#0F172A',
                        fontWeight: 500,
                        textAlign: 'left',
                        lineHeight: 1,
                        font: 'inherit',
                      }}
                    >
                      <Avatar user={t.owner} size={22} hideStatus />
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 12,
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {normalizePersonName(t.owner.name)}
                      </span>
                    </button>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>Sin asignar</span>
                  )}
                </td>
                )}
                {showEstado && <td style={tdStyle}>{estadoPill(t)}</td>}
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
  accountId,
  memberName,
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
              {memberName ? memberName : 'Detalle de estado'}
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
              width: 36,
              height: 36,
              borderRadius: 10,
              border: '1px solid #E2E8F0',
              background: '#F1F5F9',
              color: '#0F172A',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background .15s ease, color .15s ease, border-color .15s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.borderColor = '#E2E8F0';
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
            <Body
              estado={estado}
              filters={filters}
              onSelectMember={onSelectMember}
              accountId={accountId}
            />
          )}
        </div>
      </aside>
    </>
  );
};
