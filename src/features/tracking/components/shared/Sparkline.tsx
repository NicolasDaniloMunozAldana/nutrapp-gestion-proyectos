interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}

export const Sparkline = ({
  data,
  width = 120,
  height = 36,
  color = '#2563EB',
  fill = true,
}: SparklineProps) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;
  const pts = data.map(
    (v, i) =>
      [
        data.length === 1 ? width / 2 : i * stepX,
        height - ((v - min) / range) * (height - 4) - 2,
      ] as [number, number],
  );
  const d = pts
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(' ');
  const areaD = `${d} L${width},${height} L0,${height} Z`;
  const gid = `sg-${color.replace('#', '')}`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gid})`} />
        </>
      )}
      <path
        d={d}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#fff" stroke={color} strokeWidth="2" />
    </svg>
  );
};
