export type TrackingTeamsSource =
  | 'atlassian-api'
  | 'team-field'
  | 'jira-projects'
  | 'fallback'
  | 'unavailable';

export type TrackingEstado =
  | 'En curso'
  | 'En despliegue'
  | 'Detenido'
  | 'Completado'
  | 'Por hacer'
  | string;

export type TrackingAlerta = 'vencido' | 'deploy>10' | 'riesgo' | null;

export type TrackingDiario = 'hoy' | 'ayer' | 'no';

export type TrackingSemaforo = 'ok' | 'warn' | 'danger';

export interface TrackingMemberRef {
  accountId: string;
  name: string;
  initials: string;
  avatar: string;
}

export interface TrackingTeamDto {
  id: string;
  name: string;
  key?: string;
  organizationId?: string | null;
  memberCount: number;
  rating: number | null;
  source: TrackingTeamsSource;
}

export interface TrackingMemberSummaryDto extends TrackingMemberRef {
  teamId: string | null;
  teamName: string | null;
  online: boolean;
  rating: number | null;
  counts: {
    enCurso: number;
    despliegue: number;
    detenidos: number;
    completados: number;
    total: number;
  };
  comments: {
    expected: number;
    actual: number;
    coveragePct: number;
  };
  semaforo: TrackingSemaforo;
}

export interface TrackingTeamLoadDto {
  team: TrackingTeamDto;
  totalEnCurso: number;
  members: TrackingMemberSummaryDto[];
}

export interface TrackingKpisDto {
  personas: number;
  enCurso: number;
  despliegue: number;
  detenidos: number;
  completados: number;
  totalTickets: number;
  despliegueOver10: number;
  ratingAvg: number | null;
  comments: {
    expected: number;
    actual: number;
    coveragePct: number;
  };
  trends: {
    enCurso: number[];
    despliegue: number[];
    detenidos: number[];
    completados: number[];
    total: number[];
    rating: number[];
  };
  deltas: {
    enCurso: number;
    despliegue: number;
    detenidos: number;
    completados: number;
    total: number;
    rating: number;
  };
}

export interface TrackingPriorityTicketDto {
  key: string;
  summary: string;
  url: string;
  owner: TrackingMemberRef;
  teamId: string | null;
  teamName: string | null;
  estado: TrackingEstado;
  dias: number;
  sla: number;
  alerta: TrackingAlerta;
  diario: TrackingDiario;
  prioridad: string;
  reason: {
    tone: 'danger' | 'warn' | 'deploy' | 'neutral';
    label: string;
  };
  rating: number | null;
}

export interface TrackingInsightDto {
  icon: string;
  text: string;
  trend: string;
  tone: 'ok' | 'warn' | 'danger';
  metric?: {
    kind: string;
    value: number;
    deltaPct?: number;
  };
}

export interface TrackingOverviewFiltersDto {
  teamId: string | null;
  from: string | null;
  to: string | null;
  priorities: string[];
}

export interface TrackingOverviewDto {
  generatedAt: string;
  filters: TrackingOverviewFiltersDto;
  kpis: TrackingKpisDto;
  teams: TrackingTeamLoadDto[];
  priority: TrackingPriorityTicketDto[];
  insights: TrackingInsightDto[];
  heatmap: Array<{ row: string; values: number[] }>;
  burndown: Array<{ d: string; abierto: number; cerrado: number }>;
  distribution: Array<{ id: string; n: number }>;
  ranking: TrackingMemberSummaryDto[];
  activeTickets: TrackingActiveTicketDto[];
  teamsSource: TrackingTeamsSource;
}

export interface TrackingActiveTicketDto {
  key: string;
  summary: string;
  url: string;
  owner: TrackingMemberRef;
  teamId: string | null;
  teamName: string | null;
  estado: TrackingEstado;
  dias: number;
  sla: number;
  alerta: TrackingAlerta;
  diario: TrackingDiario;
  prioridad: string;
  expectedComments: number;
  actualComments: number;
}

export interface TrackingTicketDetailDto {
  key: string;
  summary: string;
  url: string;
  estado: TrackingEstado;
  dias: number;
  sla: number;
  diario: TrackingDiario;
  ultimo: string | null;
  alerta: TrackingAlerta;
  prioridad: string;
  storyPoints: number;
  expectedComments: number;
  totalComments: number;
  commentsCoveragePct: number;
  created: string;
  updated: string;
}

export interface TrackingMemberDetailDto {
  member: TrackingMemberSummaryDto;
  filters: TrackingOverviewFiltersDto;
  metrics: {
    cumplimientoSlaPct: number;
    comentariosHoyPct: number;
    despliegueAvgDias: number;
    detenidosAvgDias: number;
    cicloAvgDias: number;
    expectedComments: number;
    actualComments: number;
    commentsCoveragePct: number;
  };
  buckets: {
    vencidos: number;
    deploy10: number;
    sinComentario: number;
    detenidos: number;
    proximos: number;
  };
  commentsDonut: {
    expectedTotal: number;
    actualTotal: number;
    hoy: number;
    anteriores: number;
    pendientes: number;
  };
  completed: TrackingTicketDetailDto[];
  tickets: TrackingTicketDetailDto[];
  upcoming: TrackingPriorityTicketDto[];
}

export interface TrackingSyncStatusDto {
  lastSyncAt: string | null;
  ttlMs: number;
  stale: boolean;
  teams: {
    source: TrackingTeamsSource;
    count: number;
    teamFieldCoverage?: number;
    discoveredFieldId?: string;
  };
  jira: {
    issuesIndexed: number;
    completedIndexed: number;
    lastErrors: string[];
  };
  config: {
    orgIdSet: boolean;
    siteIdSet: boolean;
    variant: string;
    scoreEnabled: boolean;
    autoSync: boolean;
    teamsSourceMode: string;
    projectIncludePrefixes: string[];
    projectExtraKeys: string[];
  };
  errors: Array<{
    source: TrackingTeamsSource | 'jira' | 'general';
    code: string;
    message: string;
  }>;
}

export interface TrackingFilters {
  teamId: string | null;
  from: string | null;
  to: string | null;
  priorities: string[];
}
