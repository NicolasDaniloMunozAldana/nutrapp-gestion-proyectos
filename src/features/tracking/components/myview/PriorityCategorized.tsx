import { Card } from '../shared/Card';

interface PriorityCategorizedProps {
  buckets: {
    vencidos: number;
    deploy10: number;
    sinComentario: number;
    detenidos: number;
    proximos: number;
  };
}

const items = (b: PriorityCategorizedProps['buckets']) => [
  {
    id: 'vencidos',
    label: 'Vencidos',
    sub: 'Tickets que excedieron el tiempo permitido',
    color: '#EF4444',
    n: b.vencidos,
    icon: '✕',
  },
  {
    id: 'deploy10',
    label: 'Despliegue > 10 días',
    sub: 'Tickets en cualquier despliegue por más de 10 días',
    color: '#F59E0B',
    n: b.deploy10,
    icon: '↗',
  },
  {
    id: 'sincomment',
    label: 'Sin comentario diario',
    sub: 'Tickets sin actualización del día',
    color: '#F59E0B',
    n: b.sinComentario,
    icon: '!',
  },
  {
    id: 'detenidos',
    label: 'Detenidos',
    sub: 'Tickets en estado detenido',
    color: '#FB923C',
    n: b.detenidos,
    icon: '⏸',
  },
  {
    id: 'proximos',
    label: 'Próximos a vencer',
    sub: 'En riesgo de exceder el tiempo',
    color: '#2563EB',
    n: b.proximos,
    icon: '◷',
  },
];

export const PriorityCategorized = ({ buckets }: PriorityCategorizedProps) => {
  const list = items(buckets);
  const total = list.reduce((s, b) => s + b.n, 0);
  return (
    <Card padding={20}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
          Prioridad de atención
        </h2>
        <span
          style={{
            minWidth: 22,
            height: 22,
            padding: '0 7px',
            borderRadius: 999,
            background: '#FEE2E2',
            color: '#B91C1C',
            fontSize: 11.5,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {total}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((b) => (
          <div
            key={b.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr auto',
              gap: 12,
              alignItems: 'center',
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid #F1F5F9',
              background: '#fff',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: `${b.color}1A`,
                color: b.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {b.icon}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{b.label}</div>
              <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>{b.sub}</div>
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#0F172A',
                minWidth: 18,
                textAlign: 'right',
              }}
            >
              {b.n}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
