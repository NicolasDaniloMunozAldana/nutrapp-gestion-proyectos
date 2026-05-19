import type { CSSProperties } from 'react';
import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { estadoDisplayLabel } from '../shared/estadoLabel';
import { trackingTokens } from '../../styles/tokens';
import type { TrackingTicketDetailDto } from '../../types/tracking';

interface PersonalTableProps {
  tickets: TrackingTicketDetailDto[];
  teamId: string | null;
  teamName: string | null;
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

const statusPill = (estado: string, teamId: string | null, teamName: string | null) => {
  if (estado === 'En curso') return <Pill tone="blue" dot>En curso</Pill>;
  if (estado === 'En despliegue')
    return <Pill tone="deploy" dot>{estadoDisplayLabel(estado, teamId, teamName)}</Pill>;
  if (estado === 'Detenido') return <Pill tone="danger" dot>Detenido</Pill>;
  return <Pill tone="neutral" dot>{estado}</Pill>;
};

// Returns today's calendar date in Colombia timezone as a YYYY-MM-DD string,
// so we can compare it lexicographically with the date-only values that come
// from Jira (duedate / customfield_10513).
const todayInColombia = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());

const normalizeDate = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  // Both "2026-04-08" and "2026-04-08T...-05:00" reduce to the same prefix.
  return s.slice(0, 10);
};

const estadoVencimientoPill = (t: TrackingTicketDetailDto) => {
  const due = normalizeDate(t.duedate);
  const entrega = normalizeDate(t.fechaEntregaReal);
  if (!due) return <Pill tone="neutral">Sin fecha</Pill>;
  if (entrega) {
    if (entrega <= due) return <Pill tone="ok">OK</Pill>;
    return <Pill tone="danger">Entrega vencida</Pill>;
  }
  if (due < todayInColombia()) return <Pill tone="danger">Vencida</Pill>;
  return <Pill tone="ok">En plazo</Pill>;
};

const diarioPill = (d: string) => {
  if (d === 'hoy') return <Pill tone="ok" dot>Hoy</Pill>;
  if (d === 'ayer') return <Pill tone="warn" dot>Ayer</Pill>;
  return <Pill tone="danger" dot>Sin update</Pill>;
};

const prioPill = (p: string) => {
  const tone = /crit/i.test(p) || /alta|high/i.test(p) ? 'danger' : /baja|low/i.test(p) ? 'ok' : 'warn';
  const ar = /crit/i.test(p) || /alta|high/i.test(p) ? '↑' : /baja|low/i.test(p) ? '↓' : '—';
  const t = trackingTokens.status[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        fontWeight: 600,
        color: t.fg,
      }}
    >
      <span>{ar}</span>
      {p}
    </span>
  );
};

const alertaCell = (t: TrackingTicketDetailDto) => {
  if (t.alerta === 'deploy>10') return <Pill tone="danger" dot>+10 días</Pill>;
  if (t.alerta === 'vencido') return <Pill tone="danger">Vencido</Pill>;
  if (t.alerta === 'riesgo') return <Pill tone="warn" dot>Próx. a vencer</Pill>;
  if (t.estado === 'Detenido') return <Pill tone="danger">Requiere acción</Pill>;
  if (!t.duedate) return <Pill tone="neutral">Sin fecha de vencimiento</Pill>;
  return <span style={{ color: '#CBD5E1', fontSize: 12 }}>—</span>;
};

const diasCell = (t: TrackingTicketDetailDto) => {
  const tone = t.dias <= 5 ? 'ok' : t.dias <= 9 ? 'warn' : 'danger';
  const c = trackingTokens.status[tone].dot;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: '#0F172A',
        fontWeight: 500,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 999, background: c }} />
      {t.dias} días
    </span>
  );
};

export const PersonalTable = ({ tickets, teamId, teamName }: PersonalTableProps) => {
  const headers = [
    { id: 'key', label: 'Jira', w: 80 },
    { id: 'resumen', label: 'Resumen', w: undefined },
    { id: 'estado', label: 'Estado', w: 108 },
    { id: 'dias', label: 'Días en estado', w: 132 },
    { id: 'vencimiento', label: 'Estado vencimiento', w: 152 },
    { id: 'ultimo', label: 'Último comentario', w: 200 },
    { id: 'diario', label: 'Comentario diario', w: 132 },
    { id: 'prio', label: 'Prioridad', w: 100 },
    { id: 'alerta', label: 'Alerta', w: 132 },
  ];

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            Detalle de tickets
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
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            minWidth: 1100,
            borderCollapse: 'separate',
            borderSpacing: 0,
            fontSize: 13.5,
            tableLayout: 'auto',
          }}
        >
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h.id} style={{ ...thStyle, width: h.w }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 && (
              <tr>
                <td colSpan={headers.length} style={{ ...tdStyle, textAlign: 'center', color: '#94A3B8' }}>
                  Este integrante no tiene tickets activos.
                </td>
              </tr>
            )}
            {tickets.map((t, i) => (
              <tr key={t.key} style={{ background: i % 2 ? '#FCFDFE' : '#FFFFFF' }}>
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
                <td style={tdStyle}>{statusPill(t.estado, teamId, teamName)}</td>
                <td style={tdStyle}>{diasCell(t)}</td>
                <td style={tdStyle}>{estadoVencimientoPill(t)}</td>
                <td style={tdStyle}>
                  <div style={{ fontSize: 12.5, color: '#0F172A', fontWeight: 600 }}>
                    {t.ultimo ?? 'Sin comentarios'}
                  </div>
                </td>
                <td style={tdStyle}>{diarioPill(t.diario)}</td>
                <td style={tdStyle}>{prioPill(t.prioridad)}</td>
                <td style={tdStyle}>{alertaCell(t)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderTop: '1px solid #F1F5F9',
          fontSize: 11.5,
          color: '#64748B',
          fontWeight: 500,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <strong style={{ color: '#0F172A' }}>Días en estado</strong>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22C55E' }} />
            0–5 días (OK)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#F59E0B' }} />
            6–9 días (Riesgo)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#EF4444' }} />
            10+ días en estado
          </span>
        </div>
        <span>
          Registros: <strong style={{ color: '#0F172A' }}>{tickets.length}</strong>
        </span>
      </div>
    </Card>
  );
};
