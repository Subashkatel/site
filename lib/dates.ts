/*
  Dates are stored as ISO strings (2026-09-14) and shown as year and
  month only (2026.09), set in the mono face.
*/

/* Accepts what YAML frontmatter produces for a date: a Date object, "2026-09-14", or "2026-09". */
export function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value !== 'string') return undefined;

  const match = value.trim().match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
  if (!match) return undefined;

  const [, year, month, day = '01'] = match;
  return `${year}-${month}-${day}`;
}

/* 2026-09-14 becomes 2026.09 */
export function formatMonth(isoDate: string | undefined): string | undefined {
  if (!isoDate) return undefined;
  const yearAndMonth = isoDate.slice(0, 7);
  return yearAndMonth.replace('-', '.');
}

export function todayAsIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
