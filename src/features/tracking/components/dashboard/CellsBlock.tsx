import { Card } from '../shared/Card';
import { Pill } from '../shared/Pill';
import { Stars } from '../shared/Stars';
import { MemberCard } from './MemberCard';
import { colorForTeam } from '../../styles/tokens';
import { useIsMobile } from '../../hooks/useMediaQuery';
import type { TrackingTeamLoadDto } from '../../types/tracking';

interface CellsBlockProps {
  teams: TrackingTeamLoadDto[];
  onSelectMember: (accountId: string) => void;
  showRating: boolean;
}

export const CellsBlock = ({ teams, onSelectMember, showRating }: CellsBlockProps) => {
  const isMobile = useIsMobile();
  if (teams.length === 0) {
    return (
      <Card padding={24}>
        <div style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>
          No hay equipos cargados aún. Revisa <code>/api/tracking/sync/status</code> para ver
          qué fuente está activa y qué falta configurar.
        </div>
      </Card>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: isMobile ? 12 : 16,
      }}
    >
      {teams.map((t) => (
        <Card key={t.team.id} padding={isMobile ? 14 : 20}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: colorForTeam(t.team.id),
                }}
              />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#0F172A' }}>
                {t.team.name}
              </h3>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
                · {t.members.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.team.rating !== null && (
                <Stars value={t.team.rating} size={11} />
              )}
              <Pill tone="neutral">{t.totalEnCurso} en curso</Pill>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {t.members.length === 0 ? (
              <div style={{ fontSize: 12.5, color: '#94A3B8' }}>
                Sin miembros configurados para este equipo.
              </div>
            ) : (
              t.members.map((m) => (
                <MemberCard
                  key={m.accountId}
                  member={m}
                  onSelect={onSelectMember}
                  showRating={showRating}
                />
              ))
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
