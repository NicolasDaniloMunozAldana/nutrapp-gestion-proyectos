import { Card } from '../shared/Card';
import { Avatar } from '../shared/Avatar';
import { Stars } from '../shared/Stars';
import { normalizePersonName } from '../../utils/names';
import type { TrackingMemberSummaryDto } from '../../types/tracking';

interface RankingPanelProps {
  members: TrackingMemberSummaryDto[];
  onSelect: (accountId: string) => void;
}

export const RankingPanel = ({ members, onSelect }: RankingPanelProps) => {
  if (members.length === 0) return null;
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
          Top performers
        </h2>
        <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>Snapshot actual</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {members.map((m, i) => (
          <div
            key={m.accountId}
            onClick={() => onSelect(m.accountId)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                background: i === 0 ? '#F59E0B' : '#F1F5F9',
                color: i === 0 ? '#fff' : '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              {i + 1}
            </div>
            <Avatar user={m} size={32} hideStatus />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  color: '#0F172A',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {normalizePersonName(m.name)}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {m.teamName ?? '—'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {m.rating !== null && <Stars value={m.rating} size={10} />}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
