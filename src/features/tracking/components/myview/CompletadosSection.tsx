import { Card } from '../shared/Card';
import type { TrackingTicketDetailDto } from '../../types/tracking';

interface CompletadosSectionProps {
  tickets: TrackingTicketDetailDto[];
}

const tdStyle = {
  padding: '10px 14px',
  borderBottom: '1px solid #F1F5F9',
  verticalAlign: 'middle' as const,
};

const thStyle = {
  textAlign: 'left' as const,
  padding: '10px 14px',
  fontSize: 11.5,
  fontWeight: 600,
  color: '#64748B',
  background: '#F8FAFC',
  borderBottom: '1px solid #EEF2F7',
  borderTop: '1px solid #EEF2F7',
  whiteSpace: 'nowrap' as const,
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

export const CompletadosSection = ({ tickets }: CompletadosSectionProps) => {
  if (tickets.length === 0) {
    return (
      <Card padding={20}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22C55E' }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            Actividades completadas
          </h2>
          <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: 12 }}>· en el rango</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: '#94A3B8' }}>
          No hay actividades completadas en el rango seleccionado.
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
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22C55E' }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            Actividades completadas
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
              background: '#DCFCE7',
              color: '#15803D',
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            {tickets.length}
          </span>
        </div>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 90 }}>Jira</th>
              <th style={thStyle}>Resumen</th>
              <th style={{ ...thStyle, width: 110 }}>Prioridad</th>
              <th style={{ ...thStyle, width: 100 }}>Cerrado</th>
              <th style={{ ...thStyle, width: 100 }}>Días activo</th>
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
                    style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {t.key}
                  </a>
                </td>
                <td style={{ ...tdStyle, color: '#0F172A', fontWeight: 500 }}>{t.summary}</td>
                <td style={tdStyle}>{t.prioridad}</td>
                <td style={tdStyle}>{formatDate(t.updated)}</td>
                <td style={tdStyle}>{t.dias} días</td>
                <td style={tdStyle}>
                  {t.totalComments}
                  {t.expectedComments > 0 && (
                    <span style={{ color: '#94A3B8', marginLeft: 4 }}>/ {t.expectedComments}</span>
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
