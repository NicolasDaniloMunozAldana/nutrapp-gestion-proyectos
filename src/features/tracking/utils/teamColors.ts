// Brand colors per team. Matching is done by name substring (case-insensitive)
// so it survives id changes and works regardless of teams source.
const PALETTE: Array<{ test: RegExp; color: string }> = [
  { test: /sakura/i, color: '#EA5F97' },
  { test: /granada/i, color: '#FBC66A' },
  { test: /roble/i, color: '#6093EA' },
  { test: /manglar/i, color: '#FB4746' },
];

export const colorByTeamName = (teamName: string | null | undefined): string | null => {
  if (!teamName) return null;
  const match = PALETTE.find((p) => p.test.test(teamName));
  return match ? match.color : null;
};

// Subtle elegant border: thin solid 1px in the team color (no glow, no fat
// outline). Returns an empty object if the team isn't in the palette.
export const teamBorderStyle = (
  teamName: string | null | undefined,
): { borderColor?: string; borderTopColor?: string } => {
  const c = colorByTeamName(teamName);
  return c ? { borderColor: c } : {};
};
