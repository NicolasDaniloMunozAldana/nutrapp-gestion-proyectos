import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { trackingTokens } from '../../styles/tokens';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  padding?: number;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card = ({
  children,
  style,
  padding = 20,
  onClick,
  hoverable = false,
}: CardProps) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      style={{
        background: trackingTokens.bg.card,
        borderRadius: 20,
        border: `1px solid ${trackingTokens.border.soft}`,
        padding,
        boxShadow: hover ? trackingTokens.shadow.hover : trackingTokens.shadow.soft,
        transition: 'box-shadow .18s ease, transform .18s ease',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        cursor: onClick || hoverable ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
