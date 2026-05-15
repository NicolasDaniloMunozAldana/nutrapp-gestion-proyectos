import { useMemo, useState } from 'react';
import { Avatar } from '../shared/Avatar';
import { Icon } from '../shared/icons';
import { trackingTokens } from '../../styles/tokens';
import type { TrackingTeamLoadDto } from '../../types/tracking';

interface MemberSwitcherProps {
  teams: TrackingTeamLoadDto[];
  currentAccountId: string | null;
  onSelect: (accountId: string) => void;
}

export const MemberSwitcher = ({ teams, currentAccountId, onSelect }: MemberSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const all = useMemo(() => teams.flatMap((t) => t.members), [teams]);
  const current = all.find((m) => m.accountId === currentAccountId) ?? null;

  const filtered = useMemo(() => {
    if (!query.trim()) return all;
    const q = query.trim().toLowerCase();
    return all.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.teamName ?? '').toLowerCase().includes(q),
    );
  }, [all, query]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          borderRadius: 12,
          background: trackingTokens.bg.card,
          border: `1px solid ${trackingTokens.border.soft}`,
          color: trackingTokens.text.base,
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        {current ? (
          <>
            <Avatar user={current} size={24} hideStatus />
            <span>{current.name}</span>
          </>
        ) : (
          <span>Selecciona integrante</span>
        )}
        <span style={{ color: '#94A3B8' }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            zIndex: 20,
            width: 320,
            maxHeight: 360,
            overflow: 'auto',
            background: trackingTokens.bg.card,
            borderRadius: 12,
            border: `1px solid ${trackingTokens.border.soft}`,
            boxShadow: trackingTokens.shadow.hover,
            padding: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 10,
              background: trackingTokens.bg.soft,
              marginBottom: 6,
            }}
          >
            <Icon.search width={14} height={14} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o equipo…"
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 13,
                color: trackingTokens.text.base,
                flex: 1,
              }}
            />
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: 12, fontSize: 12.5, color: '#94A3B8' }}>
              Sin coincidencias.
            </div>
          )}
          {filtered.map((m) => {
            const active = m.accountId === currentAccountId;
            return (
              <button
                key={m.accountId}
                type="button"
                onClick={() => {
                  onSelect(m.accountId);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: active ? trackingTokens.bg.soft : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Avatar user={m} size={28} hideStatus />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: trackingTokens.text.base,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>
                    {m.teamName ?? 'Sin equipo'} · {m.counts.total} tickets
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
