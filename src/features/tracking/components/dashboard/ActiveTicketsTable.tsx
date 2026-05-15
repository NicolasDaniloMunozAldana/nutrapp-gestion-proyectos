import type { CSSProperties } from 'react';
import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Avatar } from '../shared/Avatar';
import { trackingTokens } from '../../styles/tokens';
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

const estadoPill = (estado: string) => {
  if (estado === 'En curso') return <Pill tone="blue" dot>En curso</Pill>;
  if (estado === 'En despliegue') return <Pill tone="deploy" dot>Despliegue</Pill>;
  if (estado === 'Detenido') return <Pill tone="danger" dot>Detenido</Pill>;
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
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: c }} />
      {t.dias}d
      <span style={{ color: '#94A3B8', fontWeight: 500 }}>/ SLA {t.sla}d</span>
    </span>
  );
};

export const ActiveTicketsTable = ({ tickets, onSelectMember }: ActiveTicketsTableProps) => {
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
  return (
    <Card padding={0}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
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
        <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>
          Limitado al scope de los 4 equipos
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            minWidth: 1050,
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 90 }}>Jira</th>
              <th style={thStyle}>Resumen</th>
              <th style={{ ...thStyle, width: 160 }}>Responsable</th>
              <th style={{ ...thStyle, width: 140 }}>Equipo</th>
              <th style={{ ...thStyle, width: 110 }}>Estado</th>
              <th style={{ ...thStyle, width: 130 }}>Días</th>
              <th style={{ ...thStyle, width: 120 }}>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.key}>
                <td style={tdStyle}>
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
                    color: '#0F172A',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={t.summary}
                >
                  {t.summary}
                </td>
                <td style={tdStyle}>
                  {t.owner.accountId ? (
                    <button
                      type="button"
                      onClick={() => onSelectMember(t.owner.accountId)}
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
                      }}
                    >
                      <Avatar user={t.owner} size={24} hideStatus />
                      <span style={{ fontSize: 12.5 }}>{t.owner.name}</span>
                    </button>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>Sin asignar</span>
                  )}
                </td>
                <td style={{ ...tdStyle, color: '#475569', fontWeight: 500 }}>
                  {t.teamName ?? '—'}
                </td>
                <td style={tdStyle}>{estadoPill(t.estado)}</td>
                <td style={tdStyle}>{diasCell(t)}</td>
                <td style={tdStyle}>
                  {t.estado === 'En curso' ? (
                    <span style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 600 }}>
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
