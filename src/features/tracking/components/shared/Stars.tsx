interface StarsProps {
  value: number;
  size?: number;
  showNumber?: boolean;
}

export const Stars = ({ value, size = 12, showNumber = true }: StarsProps) => {
  const full = Math.floor(value);
  const partial = value - full;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          let fill = 0;
          if (i < full) fill = 1;
          else if (i === full) fill = partial;
          const gid = `star-${i}-${value.toFixed(2)}`;
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 16 16" style={{ display: 'block' }}>
              <defs>
                <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${fill * 100}%`} stopColor="#F59E0B" />
                  <stop offset={`${fill * 100}%`} stopColor="#E2E8F0" />
                </linearGradient>
              </defs>
              <path
                d="M8 1.5l2.06 4.18 4.61.67-3.34 3.25.79 4.6L8 12.03l-4.12 2.17.79-4.6L1.33 6.35l4.61-.67L8 1.5z"
                fill={`url(#${gid})`}
                stroke="#F59E0B"
                strokeWidth="0.5"
              />
            </svg>
          );
        })}
      </span>
      {showNumber && (
        <span style={{ fontWeight: 600, color: '#0F172A', fontSize: size + 1 }}>
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
};
