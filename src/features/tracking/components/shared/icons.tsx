import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

export const Icon = {
  grid: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  team: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 19c.8-2.6 3.2-4 6-4s5.2 1.4 6 4M14.5 19c.5-1.8 2-3 4.5-3s4 1.2 4.5 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  ticket: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M11 6v12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="2 2"
      />
    </svg>
  ),
  refresh: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  spark: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  search: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  filter: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M4 5h16l-6 8v6l-4-2v-4L4 5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrowUp: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrowDn: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  alert: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path
        d="M12 3l9.5 16.5h-19L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 10v4M12 17v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};
