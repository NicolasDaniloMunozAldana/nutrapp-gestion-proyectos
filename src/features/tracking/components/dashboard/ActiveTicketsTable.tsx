import type { CSSProperties } from 'react';
import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Avatar } from '../shared/Avatar';
import { estadoDisplayLabel } from '../shared/estadoLabel';
import { trackingTokens } from '../../styles/tokens';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { normalizePersonName } from '../../utils/names';
import type { TrackingActiveTicketDto } from '../../types/tracking';

interface ActiveTicketsTableProps {
  tickets: TrackingActiveTicketDto[];
  onSelectMember: (accountId: string) => void;
}

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
  borderBottom: '1px solid #F1F5F9',
  verticalAlign: 'middle',
};

const truncateCell: CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 0,
};

const estadoPill = (estado: string, teamId: string | null, teamName: string | null) => {
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
  return <Pill tone="neutral" dot>{estado}</Pill>;
};

const diasCell = (t: TrackingActiveTicketDto) => {
  const tone = t.dias <= 5 ? 'ok' : t.dias <= 9 ? 'warn' : 'danger';
  const c = trackingTokens.status[tone].dot;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        color: '#0F172A',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: c, flex: 'none' }} />
      {t.dias}d
      <span style={{ color: '#94A3B8', fontWeight: 500 }}>/ {t.sla}d</span>
    </span>
  );
};

export const ActiveTicketsTable = ({ tickets, onSelectMember }: ActiveTicketsTableProps) => {
  const isMobile = useIsMobile();
  if (tickets.length === 0) {
    return (
      <Card padding={20}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
          Tickets activos
        </h2>
        <div style={{ marginTop: 8, fontSize: 13, color: '#94A3B8' }}>
          No hay tickets activos en el rango / scope actual.
        </div>
      </Card>
    );
  }
  const headerBar = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: isMobile ? '14px 14px 10px' : '18px 20px 14px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <h2 style={{ margin: 0, fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#0F172A' }}>
          Tickets activos
        </h2>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 22,
            height: 22,
            padding: '0 7px',
            borderRadius: 999,
            background: '#F1F5F9',
            color: '#475569',
            fontSize: 11.5,
            fontWeight: 700,
          }}
        >
          {tickets.length}
        </span>
      </div>
      {!isMobile && (
        <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>
          Limitado al scope de los 4 equipos
        </span>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Card padding={0} style={{ overflow: 'hidden' }}>
        {headerBar}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {tickets.map((t) => (
            <div
              key={t.key}
              style={{
                padding: '12px 14px',
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
                {estadoPill(t.estado, t.teamId, t.teamName)}
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
                    onClick={() => onSelectMember(t.owner.accountId)}
                    title={normalizePersonName(t.owner.name)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
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
                {diasCell(t)}
              </div>
              <div style={{ fontSize: 11.5, color: '#94A3B8' }} title={t.teamName ?? ''}>
                {t.teamName ?? '—'}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      {headerBar}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            minWidth: 720,
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: 13,
            tableLayout: 'fixed',
          }}
        >
          <colgroup>
            <col style={{ width: 96 }} />
            <col />
            <col style={{ width: 180 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 116 }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 110 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>Jira</th>
              <th style={thStyle}>Resumen</th>
              <th style={thStyle}>Responsable</th>
              <th style={thStyle}>Equipo</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Días</th>
              <th style={thStyle}>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
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
                      onClick={() => onSelectMember(t.owner.accountId)}
                      title={normalizePersonName(t.owner.name)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: '#0F172A',
                        fontWeight: 500,
                        maxWidth: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <Avatar user={t.owner} size={24} hideStatus />
                      <span
                        style={{
                          fontSize: 12.5,
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
                <td
                  style={{
                    ...tdStyle,
                    ...truncateCell,
                    color: '#475569',
                    fontWeight: 500,
                  }}
                  title={t.teamName ?? ''}
                >
                  {t.teamName ?? '—'}
                </td>
                <td style={tdStyle}>{estadoPill(t.estado, t.teamId, t.teamName)}</td>
                <td style={tdStyle}>{diasCell(t)}</td>
                <td style={tdStyle}>
                  {t.estado === 'En curso' ? (
                    <span style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {t.actualComments}
                      <span style={{ color: '#94A3B8', fontWeight: 500 }}>
                        {' '}
                        / {t.expectedComments}
                      </span>
                    </span>
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: 12 }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
