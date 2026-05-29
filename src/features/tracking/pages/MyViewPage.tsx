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
import { StateDetailDrawer } from '../components/dashboard/StateDetailDrawer';
import { trackingTokens } from '../styles/tokens';
import { useIsMobile } from '../hooks/useMediaQuery';
import { normalizePersonName } from '../utils/names';
import { defaultRange, rangeForPreset, toISODate } from '../utils/ranges';
import type { TrackingFilters } from '../types/tracking';

const PRIORITY_OPTIONS = ['Crítica', 'Alta', 'Media', 'Baja'];

// Mi Vista date presets. Mirrors the general filter ranges plus "Todo", which
// spans from the developer's first activity to today.
type FilterPreset = 'today' | '7d' | '30d' | '60d' | 'semester' | 'year' | 'all' | null;
type PresetAction = Exclude<FilterPreset, null> | 'clear';

const MYVIEW_PRESETS: Array<{ key: PresetAction; label: string }> = [
  { key: 'today', label: 'Hoy' },
  { key: '7d', label: '7d' },
  { key: '30d', label: '30d' },
  { key: '60d', label: '60d' },
  { key: 'semester', label: 'Semestre' },
  { key: 'year', label: 'Año' },
  { key: 'all', label: 'Todo' },
  { key: 'clear', label: 'Limpiar' },
];

export const MyViewPage = () => {
  const { accountId: routeAccountId } = useParams<{ accountId?: string }>();
  const navigate = useNavigate();
  const { data: teams } = useTeams();

  const initialRange = useMemo(defaultRange, []);
  const [from, setFrom] = useState<string>(initialRange.from);
  const [to, setTo] = useState<string>(initialRange.to);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<FilterPreset>('30d');
  const [drawerEstado, setDrawerEstado] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const stickyTop = isMobile ? 92 : 112;
  const contentPadding = isMobile ? '12px 12px 32px' : '20px 32px 40px';

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

  // Switching developer closes any open per-estado drawer so it never shows
  // the previous person's tickets.
  useEffect(() => {
    setDrawerEstado(null);
  }, [activeAccountId]);

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

  const handlePreset = (preset: PresetAction) => {
    if (preset === 'clear') {
      setFrom('');
      setTo('');
      setActivePreset(null);
      return;
    }
    if (preset === 'all') {
      // From the developer's first activity to today. The last valid day is
      // handled downstream (the work average always excludes the current day).
      setFrom(detail?.startDate ?? '');
      setTo(toISODate(new Date()));
      setActivePreset('all');
      return;
    }
    const { from: nextFrom, to: nextTo } = rangeForPreset(preset);
    setFrom(nextFrom);
    setTo(nextTo);
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
            {normalizePersonName(detail.member.name)}{' '}
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
          padding: contentPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 12 : 16,
        }}
      >
        {activeAccountId && (
          <div
            style={{
              position: 'sticky',
              top: stickyTop,
              zIndex: 4,
              background: trackingTokens.bg.app,
              padding: '4px 0 8px',
              marginTop: -4,
              boxShadow: '0 6px 12px -10px rgba(15,23,42,0.18)',
            }}
          >
          <div
            style={{
              display: isMobile ? 'grid' : 'flex',
              gridTemplateColumns: isMobile ? '1fr' : undefined,
              flexWrap: isMobile ? undefined : 'wrap',
              alignItems: isMobile ? 'stretch' : 'center',
              gap: 12,
              padding: '12px 16px',
              background: '#fff',
              borderRadius: 14,
              border: `1px solid ${trackingTokens.border.soft}`,
              boxShadow: trackingTokens.shadow.soft,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                gap: 8,
                minWidth: 0,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 11,
                  color: '#64748B',
                  fontWeight: 600,
                  minWidth: 0,
                }}
              >
                Desde
                <input
                  type="date"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setActivePreset(null);
                  }}
                  style={{
                    height: isMobile ? 40 : 34,
                    borderRadius: 10,
                    border: `1px solid ${trackingTokens.border.soft}`,
                    padding: '0 10px',
                    fontSize: 13,
                    width: '100%',
                    minWidth: 0,
                  }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 11,
                  color: '#64748B',
                  fontWeight: 600,
                  minWidth: 0,
                }}
              >
                Hasta
                <input
                  type="date"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setActivePreset(null);
                  }}
                  style={{
                    height: isMobile ? 40 : 34,
                    borderRadius: 10,
                    border: `1px solid ${trackingTokens.border.soft}`,
                    padding: '0 10px',
                    fontSize: 13,
                    width: '100%',
                    minWidth: 0,
                  }}
                />
              </label>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                overflowX: isMobile ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isMobile ? 2 : 0,
              }}
            >
              {MYVIEW_PRESETS.map(({ key, label }) => {
                const active = key !== 'clear' && activePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handlePreset(key)}
                    style={{
                      padding: isMobile ? '8px 12px' : '5px 10px',
                      minHeight: isMobile ? 36 : 'auto',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: active ? '#0F172A' : '#F1F5F9',
                      color: active ? '#fff' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                marginLeft: isMobile ? 0 : 'auto',
                flexWrap: isMobile ? 'nowrap' : 'wrap',
                overflowX: isMobile ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isMobile ? 2 : 0,
              }}
            >
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600, flex: 'none' }}>
                Prioridad:
              </span>
              {PRIORITY_OPTIONS.map((p) => {
                const active = priorities.some((x) => x.toLowerCase() === p.toLowerCase());
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePriority(p)}
                    style={{
                      padding: isMobile ? '8px 12px' : '5px 10px',
                      minHeight: isMobile ? 36 : 'auto',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: active ? '#0F172A' : '#F1F5F9',
                      color: active ? '#fff' : '#475569',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
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
            <PersonalHero
              member={detail.member}
              showRating={showRating}
              work={detail.work}
              onSelectEstado={setDrawerEstado}
            />
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
      <StateDetailDrawer
        estado={drawerEstado}
        filters={filters}
        accountId={activeAccountId}
        memberName={detail ? normalizePersonName(detail.member.name) : undefined}
        onClose={() => setDrawerEstado(null)}
      />
    </TrackingShell>
  );
};
