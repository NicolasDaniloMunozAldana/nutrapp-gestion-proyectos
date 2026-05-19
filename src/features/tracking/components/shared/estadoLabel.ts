// Team-specific display overrides for the "estado" pill. The underlying
// estado value is never changed — only the visible label.
export const GRANADA_TEAM_ID = '2353db64-313a-4337-afec-9eebcc4ef7bc';

const isGranada = (teamId: string | null | undefined, teamName: string | null | undefined): boolean => {
  if (teamId === GRANADA_TEAM_ID) return true;
  return !!teamName && /granada/i.test(teamName);
};

const isDeployEstado = (estado: string): boolean =>
  estado === 'Despliegue a DEV' ||
  estado === 'Despliegue a QA' ||
  estado === 'Despliegue a PROD' ||
  estado === 'En despliegue';

export const estadoDisplayLabel = (
  estado: string,
  teamId: string | null | undefined,
  teamName: string | null | undefined = null,
): string => {
  if (isDeployEstado(estado) && isGranada(teamId, teamName)) return 'En Aprobación';
  return estado;
};
