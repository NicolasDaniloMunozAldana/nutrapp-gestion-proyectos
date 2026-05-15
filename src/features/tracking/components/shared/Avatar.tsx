import { colorForUser } from '../../styles/tokens';
import type { TrackingMemberRef } from '../../types/tracking';

interface AvatarProps {
  user: TrackingMemberRef & { online?: boolean };
  size?: number;
  ring?: boolean;
  hideStatus?: boolean;
}

export const Avatar = ({ user, size = 36, ring = false, hideStatus = false }: AvatarProps) => {
  const bg = colorForUser(user.accountId || user.name);
  const useImg = !!user.avatar;
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      {useImg ? (
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: size,
            height: size,
            borderRadius: 999,
            objectFit: 'cover',
            boxShadow: ring ? '0 0 0 2px #fff, 0 0 0 4px #2563EB' : '0 0 0 2px #fff',
          }}
        />
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: 999,
            background: bg,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: size * 0.38,
            boxShadow: ring ? '0 0 0 2px #fff, 0 0 0 4px #2563EB' : '0 0 0 2px #fff',
            letterSpacing: 0.2,
          }}
        >
          {user.initials}
        </div>
      )}
      {!hideStatus && (
        <span
          style={{
            position: 'absolute',
            right: -1,
            bottom: -1,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: 999,
            background: user.online ? '#22C55E' : '#94A3B8',
            boxShadow: '0 0 0 2px #fff',
          }}
        />
      )}
    </div>
  );
};
