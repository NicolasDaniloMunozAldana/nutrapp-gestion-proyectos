import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TrackingShell } from './TrackingShell';
import { useMemberDetail } from '../hooks/useMemberDetail';
import { useTeams } from '../hooks/useTeams';
import { PersonalHero } from '../components/myview/PersonalHero';
import { MetricStrip } from '../components/myview/MetricStrip';
import { PriorityCategorized } from '../components/myview/PriorityCategorized';
import { CommentsDonut } from '../components/myview/CommentsDonut';
import { DeployGauge } from '../components/myview/DeployGauge';
import { PersonalTable } from '../components/myview/PersonalTable';
import { ProximosVencimientos } from '../components/myview/ProximosVencimientos';
import { MemberSwitcher } from '../components/myview/MemberSwitcher';
import { CompletadosSection } from '../components/myview/CompletadosSection';
import { CommentsCoverageCard } from '../components/myview/CommentsCoverageCard';
import { SkeletonCard } from '../components/shared/Skeleton';
import { Card } from '../components/shared/Card';
import { MemberCard } from '../components/dashboard/MemberCard';
import { trackingTokens } from '../styles/tokens';
import type { TrackingFilters } from '../types/tracking';

const PRIORITY_OPTIONS = ['Crítica', 'Alta', 'Media', 'Baja'];

const toISODate = (d: Date): string => d.toISOString().slice(0, 10);

const defaultRange = (): { from: string; to: string } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30);
  return { from: toISODate(start), to: toISODate(now) };
};

type FilterPreset = 'today' | '7d' | '30d' | null;

export const MyViewPage = () => {
  const { accountId: routeAccountId } = useParams<{ accountId?: string }>();
  const navigate = useNavigate();
  const { data: teams } = useTeams();

  const initialRange = useMemo(defaultRange, []);
  const [from, setFrom] = useState<string>(initialRange.from);
  const [to, setTo] = useState<string>(initialRange.to);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<FilterPreset>('30d');

  const filters: TrackingFilters = useMemo(
    () => ({
      teamId: null,
      from: from || null,
      to: to || null,
      priorities,
    }),
    [from, to, priorities],
  );

  const firstAccountId = useMemo(
    () => teams?.flatMap((t) => t.members)[0]?.accountId ?? null,
    [teams],
  );

  const activeAccountId = routeAccountId ?? null;

  useEffect(() => {
    if (!activeAccountId && firstAccountId) {
      navigate(`/mi-vista/${firstAccountId}`, { replace: true });
    }
  }, [activeAccountId, firstAccountId, navigate]);

  const {
    data: detail,
    isLoading,
    error,
    refetch,
  } = useMemberDetail(activeAccountId, filters);

  const showRating = !!detail && detail.member.rating !== null;

  const togglePriority = (p: string) => {
    const lower = p.toLowerCase();
    const exists = priorities.some((x) => x.toLowerCase() === lower);
    if (exists) setPriorities(priorities.filter((x) => x.toLowerCase() !== lower));
    else setPriorities([...priorities, p]);
  };

  const handlePreset = (preset: 'today' | '7d' | '30d' | 'clear') => {
    const now = new Date();
    if (preset === 'clear') {
      setFrom('');
      setTo('');
      setActivePreset(null);
      return;
    }
    if (preset === 'today') {
      const d = toISODate(now);
      setFrom(d);
      setTo(d);
      setActivePreset('today');
      return;
    }
    const days = preset === '7d' ? 7 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - days);
    setFrom(toISODate(start));
    setTo(toISODate(now));
    setActivePreset(preset);
  };

  const rightSlot = (
    <MemberSwitcher
      teams={teams ?? []}
      currentAccountId={activeAccountId}
      onSelect={(id) => navigate(`/mi-vista/${id}`)}
    />
  );

  return (
    <TrackingShell
      active="mi-vista"
      title={
        detail ? (
          <>
            {detail.member.name}{' '}
            <span style={{ color: '#94A3B8', fontWeight: 500 }}>
              — {detail.member.teamName ?? 'Sin equipo'}
            </span>
          </>
        ) : (
          <>Mi Vista</>
        )
      }
      subtitle={detail ? <span>Seguimiento de ejecución</span> : undefined}
      rightSlot={rightSlot}
    >
      <div
        style={{
          padding: '20px 32px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {activeAccountId && (
          <div
            style={{
              position: 'sticky',
              top: 112,
              zIndex: 4,
              background: trackingTokens.bg.app,
              padding: '4px 0 8px',
              marginTop: -4,
              boxShadow: '0 6px 12px -10px rgba(15,23,42,0.18)',
            }}
          >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: '#fff',
              borderRadius: 14,
              border: `1px solid ${trackingTokens.border.soft}`,
              boxShadow: trackingTokens.shadow.soft,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Desde</label>
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setActivePreset(null);
                }}
                style={{
                  height: 34,
                  borderRadius: 10,
                  border: `1px solid ${trackingTokens.border.soft}`,
                  padding: '0 10px',
                  fontSize: 13,
                }}
              />
              <label style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Hasta</label>
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setActivePreset(null);
                }}
                style={{
                  height: 34,
                  borderRadius: 10,
                  border: `1px solid ${trackingTokens.border.soft}`,
                  padding: '0 10px',
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['today', '7d', '30d', 'clear'] as const).map((p) => {
                const active = p !== 'clear' && activePreset === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePreset(p)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: active ? '#0F172A' : '#F1F5F9',
                      color: active ? '#fff' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {p === 'today' ? 'Hoy' : p === '7d' ? '7d' : p === '30d' ? '30d' : 'Limpiar'}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                marginLeft: 'auto',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Prioridad:</span>
              {PRIORITY_OPTIONS.map((p) => {
                const active = priorities.some((x) => x.toLowerCase() === p.toLowerCase());
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePriority(p)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: active ? '#0F172A' : '#F1F5F9',
                      color: active ? '#fff' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          </div>
        )}

        {!activeAccountId && (
          <Card padding={32}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
              Selecciona un integrante
            </h2>
            <p style={{ marginTop: 6, fontSize: 13, color: '#475569' }}>
              Pulsa una persona en el Dashboard, o usa el selector arriba a la derecha.
            </p>
            {teams && teams.length > 0 && (
              <div
                style={{
                  marginTop: 18,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 12,
                }}
              >
                {teams.flatMap((t) =>
                  t.members.slice(0, 4).map((m) => (
                    <MemberCard
                      key={m.accountId}
                      member={m}
                      onSelect={(id) => navigate(`/mi-vista/${id}`)}
                      showRating={false}
                    />
                  )),
                )}
              </div>
            )}
          </Card>
        )}

        {activeAccountId && error && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: '#FEE2E2',
              color: '#B91C1C',
              border: '1px solid #FCA5A5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>No se pudo cargar el integrante: {(error as Error).message}</span>
            <button
              type="button"
              onClick={() => refetch()}
              style={{
                background: '#B91C1C',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reintentar
            </button>
          </div>
        )}

        {activeAccountId && (isLoading || !detail) && !error && (
          <>
            <SkeletonCard height={200} />
            <SkeletonCard height={80} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              <SkeletonCard height={300} />
              <SkeletonCard height={300} />
              <SkeletonCard height={300} />
            </div>
            <SkeletonCard height={300} />
          </>
        )}

        {activeAccountId && detail && (
          <>
            <PersonalHero member={detail.member} showRating={showRating} />
            <MetricStrip metrics={detail.metrics} />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16,
                alignItems: 'stretch',
              }}
            >
              <PriorityCategorized buckets={detail.buckets} />
              <CommentsDonut data={detail.commentsDonut} />
              <DeployGauge avgDays={detail.metrics.despliegueAvgDias} />
              <CommentsCoverageCard
                expected={detail.metrics.expectedComments}
                actual={detail.metrics.actualComments}
                coveragePct={detail.metrics.commentsCoveragePct}
              />
            </div>
            <PersonalTable
              tickets={detail.tickets}
              teamId={detail.member.teamId}
              teamName={detail.member.teamName}
            />
            <CompletadosSection tickets={detail.completed} />
            <ProximosVencimientos upcoming={detail.upcoming} />
          </>
        )}
      </div>
    </TrackingShell>
  );
};
