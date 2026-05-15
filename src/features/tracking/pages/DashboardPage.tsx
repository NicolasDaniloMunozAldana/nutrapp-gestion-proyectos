import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrackingShell } from './TrackingShell';
import { useOverview } from '../hooks/useOverview';
import { KpiRow } from '../components/dashboard/KpiRow';
import { CellsBlock } from '../components/dashboard/CellsBlock';
import { PriorityPanel } from '../components/dashboard/PriorityPanel';
import { InsightsPanel } from '../components/dashboard/InsightsPanel';
import { HeatmapPanel } from '../components/dashboard/HeatmapPanel';
import { BurndownPanel } from '../components/dashboard/BurndownPanel';
import { DistributionPanel } from '../components/dashboard/DistributionPanel';
import { RankingPanel } from '../components/dashboard/RankingPanel';
import { FiltersBar } from '../components/dashboard/FiltersBar';
import { SkeletonCard } from '../components/shared/Skeleton';
import type { TrackingFilters } from '../types/tracking';

const SectionHeader = ({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 12,
      marginTop: 4,
    }}
  >
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 700,
          color: '#0F172A',
          letterSpacing: 0.2,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <div style={{ marginTop: 4, fontSize: 12.5, color: '#94A3B8', fontWeight: 500 }}>
          {subtitle}
        </div>
      )}
    </div>
    {right}
  </div>
);

const toISODate = (d: Date): string => d.toISOString().slice(0, 10);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [priorities, setPriorities] = useState<string[]>([]);

  const filters: TrackingFilters = useMemo(
    () => ({
      teamId: teamId || null,
      from: from || null,
      to: to || null,
      priorities,
    }),
    [teamId, from, to, priorities],
  );

  const { data, isLoading, error, refetch } = useOverview(filters);

  const showRating = useMemo(
    () => (data?.ranking ? data.ranking.length > 0 : false),
    [data?.ranking],
  );

  const handleSelectMember = (accountId: string) => navigate(`/mi-vista/${accountId}`);

  const teamOptions = useMemo(
    () => (data?.teams ?? []).map((t) => ({ id: t.team.id, name: t.team.name })),
    [data?.teams],
  );

  const membersPreview = useMemo(
    () => (data?.teams ?? []).flatMap((t) => t.members),
    [data?.teams],
  );

  const handlePreset = (preset: 'today' | '7d' | '30d' | 'sprint' | 'clear') => {
    const now = new Date();
    if (preset === 'clear') {
      setFrom('');
      setTo('');
      return;
    }
    if (preset === 'today') {
      const d = toISODate(now);
      setFrom(d);
      setTo(d);
      return;
    }
    const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 14;
    const start = new Date(now);
    start.setDate(now.getDate() - days);
    setFrom(toISODate(start));
    setTo(toISODate(now));
  };

  const subtitle = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: '#22C55E',
          boxShadow: '0 0 0 4px rgba(34,197,94,0.18)',
        }}
      />
      En vivo
    </span>
  );

  return (
    <TrackingShell
      active="dashboard"
      title={
        <>
          Seguimiento Jira{' '}
          <span style={{ color: '#94A3B8', fontWeight: 500 }}>— todo el equipo</span>
        </>
      }
      subtitle={subtitle}
    >
      <div
        style={{
          padding: '20px 32px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <FiltersBar
          teamOptions={teamOptions}
          teamId={teamId}
          onTeamChange={setTeamId}
          priorities={priorities}
          onPrioritiesChange={setPriorities}
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          onPreset={handlePreset}
        />

        {error && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: '#FEE2E2',
              color: '#B91C1C',
              border: '1px solid #FCA5A5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <span>Error cargando overview: {(error as Error).message}</span>
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

        <SectionHeader
          title="KPIs globales"
          subtitle="Visión general de carga y cumplimiento"
          right={
            <span style={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 500 }}>
              {teamId
                ? teamOptions.find((t) => t.id === teamId)?.name ?? 'Equipo'
                : 'Todos los equipos'}
              {priorities.length > 0 && ` · ${priorities.join(', ')}`}
              {from && ` · desde ${from}`}
              {to && ` · hasta ${to}`}
            </span>
          }
        />
        {isLoading || !data ? (
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <KpiRow kpis={data.kpis} membersPreview={membersPreview} showRating={showRating} />
        )}

        <SectionHeader
          title="Carga por equipo"
          subtitle={
            data
              ? `${data.teams.length} equipo${data.teams.length === 1 ? '' : 's'} · ${membersPreview.length} integrantes`
              : 'Cargando…'
          }
        />
        {isLoading || !data ? (
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} height={260} />
            ))}
          </div>
        ) : (
          <CellsBlock
            teams={data.teams}
            onSelectMember={handleSelectMember}
            showRating={showRating}
          />
        )}

        {data && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: 16,
            }}
          >
            <PriorityPanel tickets={data.priority} />
            <InsightsPanel insights={data.insights} />
          </div>
        )}

        {data &&
          (data.heatmap.length > 0 ||
            data.burndown.length > 1 ||
            data.distribution.length > 0) && (
            <>
              <SectionHeader
                title="Indicadores complementarios"
                subtitle="Actividad, ritmo de cierre y prioridad"
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)',
                  gap: 16,
                }}
              >
                <HeatmapPanel rows={data.heatmap} />
                <BurndownPanel data={data.burndown} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <DistributionPanel data={data.distribution} />
                  <RankingPanel members={data.ranking} onSelect={handleSelectMember} />
                </div>
              </div>
            </>
          )}
      </div>
    </TrackingShell>
  );
};
