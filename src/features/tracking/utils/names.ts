// Display-friendly normalization for person names.
// Converts inputs like "JORGE EDUARDO GARAY GUTIERREZ" or
// "Sebastian Andres Alvarez Lambertinez" into "Jorge Garay" / "Sebastian Alvarez"
// (first name + paternal surname), keeping single/double-token names intact.
const toTitle = (s: string): string =>
  s ? s[0].toLocaleUpperCase('es-CO') + s.slice(1).toLocaleLowerCase('es-CO') : s;

const split = (raw: string | null | undefined): string[] =>
  (raw ?? '').trim().split(/\s+/).filter(Boolean);

export const normalizePersonName = (raw: string | null | undefined): string => {
  const parts = split(raw).map(toTitle);
  const n = parts.length;
  if (n === 0) return '';
  if (n === 1) return parts[0];
  if (n === 2) return `${parts[0]} ${parts[1]}`;
  // Spanish convention: [First] [Middle?] [Paternal] [Maternal?]
  // The paternal surname is always the second-to-last token.
  return `${parts[0]} ${parts[n - 2]}`;
};

export const personInitials = (raw: string | null | undefined): string => {
  const parts = split(normalizePersonName(raw));
  if (parts.length === 0) return '??';
  const letters = parts.map((p) => p[0] ?? '').join('');
  return letters.slice(0, 2).toLocaleUpperCase('es-CO') || '??';
};
