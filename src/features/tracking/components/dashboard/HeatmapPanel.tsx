import { Card } from '../shared/Card';

interface HeatmapPanelProps {
  rows: Array<{ row: string; values: number[] }>;
}

const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const HeatmapPanel = ({ rows }: HeatmapPanelProps) => {
  if (rows.length === 0 || rows.every((r) => r.values.every((v) => v === 0))) {
    return null;
  }
  const max = Math.max(1, ...rows.flatMap((r) => r.values));
  const cellColor = (v: number): string => {
    if (v === 0) return '#F1F5F9';
    const a = 0.18 + (v / max) * 0.72;
    return `rgba(37,99,235,${a.toFixed(2)})`;
  };
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
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
            Actividad semanal
          </h2>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
            Comentarios diarios por equipo
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: '#94A3B8',
            fontWeight: 600,
          }}
        >
          <span>menos</span>
          {[0.18, 0.36, 0.55, 0.75, 0.9].map((a, i) => (
            <span
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: `rgba(37,99,235,${a})`,
              }}
            />
          ))}
          <span>más</span>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px repeat(7, 1fr)',
          rowGap: 8,
          columnGap: 6,
          alignItems: 'center',
        }}
      >
        <div />
        {days.map((d) => (
          <div
            key={d}
            style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', fontWeight: 600 }}
          >
            {d}
          </div>
        ))}
        {rows.map((row) => (
          <DayRow key={row.row} row={row} max={max} cellColor={cellColor} />
        ))}
      </div>
    </Card>
  );
};

const DayRow = ({
  row,
  max,
  cellColor,
}: {
  row: { row: string; values: number[] };
  max: number;
  cellColor: (v: number) => string;
}) => (
  <>
    <div
      style={{
        fontSize: 12.5,
        color: '#475569',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {row.row}
    </div>
    {row.values.map((v, i) => (
      <div
        key={i}
        style={{
          aspectRatio: '1.4 / 1',
          borderRadius: 8,
          background: cellColor(v),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          color: v / max > 0.5 ? '#fff' : '#1E293B',
        }}
      >
        {v || ''}
      </div>
    ))}
  </>
);
