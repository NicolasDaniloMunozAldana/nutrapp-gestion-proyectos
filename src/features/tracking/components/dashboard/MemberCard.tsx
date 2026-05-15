import { Card } from '../shared/Card';
import { Avatar } from '../shared/Avatar';
import { Stars } from '../shared/Stars';
import { Semaforo } from '../shared/Semaforo';
import type { TrackingMemberSummaryDto } from '../../types/tracking';

interface MemberCardProps {
  member: TrackingMemberSummaryDto;
  onSelect: (accountId: string) => void;
  showRating: boolean;
}

const Stat = ({ n, l, c }: { n: number; l: string; c: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 16, fontWeight: 700, color: c, lineHeight: 1 }}>{n}</div>
    <div
      style={{
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 600,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {l}
    </div>
  </div>
);

export const MemberCard = ({ member, onSelect, showRating }: MemberCardProps) => {
  return (
    <Card
      padding={16}
      hoverable
      onClick={() => onSelect(member.accountId)}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar user={member} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: '#0F172A',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {member.name}
          </div>
          <div style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>
            {member.teamName ?? 'Sin equipo'}
          </div>
        </div>
        <Semaforo level={member.semaforo} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 4,
          background: '#F8FAFC',
          borderRadius: 12,
          padding: '10px 8px',
        }}
      >
        <Stat n={member.counts.enCurso} l="Curso" c="#2563EB" />
        <Stat n={member.counts.despliegue} l="Deploy" c="#8B5CF6" />
        <Stat n={member.counts.detenidos} l="Stop" c="#EF4444" />
        <Stat n={member.counts.completados} l="Done" c="#22C55E" />
        <Stat n={member.counts.total} l="Total" c="#0F172A" />
      </div>
      {member.comments.expected > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 999, background: '#F1F5F9', overflow: 'hidden' }}>
            <div
              style={{
                width: `${member.comments.coveragePct}%`,
                height: '100%',
                background: member.comments.coveragePct >= 80 ? '#22C55E' : member.comments.coveragePct >= 60 ? '#F59E0B' : '#EF4444',
                borderRadius: 999,
              }}
            />
          </div>
          <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 600 }}>
            {member.comments.actual}/{member.comments.expected} comentarios
          </span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {member.rating !== null ? (
          <Stars value={member.rating} size={11} />
        ) : showRating ? (
          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
            Sin calificación
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>
            {member.counts.total} ticket{member.counts.total === 1 ? '' : 's'}
          </span>
        )}
        <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>Ver detalle →</span>
      </div>
    </Card>
  );
};
