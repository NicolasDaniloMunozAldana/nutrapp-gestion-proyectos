import type { CSSProperties } from 'react';
import { trackingTokens } from '../../styles/tokens';

interface SkeletonProps {
  height?: number;
  width?: number | string;
  radius?: number;
  style?: CSSProperties;
}

export const Skeleton = ({ height = 16, width = '100%', radius = 8, style }: SkeletonProps) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      background: `linear-gradient(90deg, ${trackingTokens.border.softer} 25%, #E8EDF4 50%, ${trackingTokens.border.softer} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'tracking-shimmer 1.4s infinite',
      ...style,
    }}
  />
);

export const SkeletonCard = ({ height = 168 }: { height?: number }) => (
  <div
    style={{
      height,
      borderRadius: 20,
      background: trackingTokens.bg.card,
      border: `1px solid ${trackingTokens.border.soft}`,
      boxShadow: trackingTokens.shadow.soft,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
  >
    <Skeleton width={120} />
    <Skeleton height={28} width={'60%'} />
    <Skeleton width={'45%'} />
  </div>
);

const STYLE = `
@keyframes tracking-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

export const SkeletonStyleTag = () => <style>{STYLE}</style>;
