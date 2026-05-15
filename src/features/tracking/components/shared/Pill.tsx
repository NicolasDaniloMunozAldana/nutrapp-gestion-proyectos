import type { CSSProperties, ReactNode } from 'react';
import { trackingTokens } from '../../styles/tokens';

export type PillTone = 'ok' | 'warn' | 'danger' | 'deploy' | 'blue' | 'neutral';

interface PillProps {
  tone?: PillTone;
  dot?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export const Pill = ({ tone = 'neutral', dot = false, children, style }: PillProps) => {
  const t = trackingTokens.status[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        color: t.fg,
        background: t.bg,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && (
        <span
          style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }}
        />
      )}
      {children}
    </span>
  );
};
