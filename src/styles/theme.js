// src/styles/theme.js
// ─── Single source of truth for all colors ───────────────────────────────────

export const colors = {
  primary:     'hsl(var(--primary))',
  primaryFg:   'hsl(var(--primary-foreground))',
  background:  'hsl(var(--background))',
  card:        'hsl(var(--card))',
  muted:       'hsl(var(--muted))',
  mutedFg:     'hsl(var(--muted-foreground))',
  foreground:  'hsl(var(--foreground))',
  border:      'hsl(var(--border))',
  destructive: 'hsl(var(--destructive))',

  // Raw hex — only for canvas/SVG where Tailwind classes don't apply
  status: {
    draft:       '#6b7280',
    underReview: '#d97706',
    approved:    '#16a34a',
    rejected:    '#dc2626',
    ecrPending:  '#ea580c',
    closed:      '#9ca3af',
  },
}

// ─── Dark theme base tokens (used by dashboard + auth pages) ─────────────────
export const dark = {
  bg:           '#080d1a',
  surface:      'rgba(13, 21, 38, 0.9)',
  card:         'rgba(255, 255, 255, 0.04)',
  cardBorder:   'rgba(255, 255, 255, 0.08)',
  cardBorderHover: 'rgba(255, 255, 255, 0.14)',
  text:         '#ffffff',
  textSub:      'rgba(255, 255, 255, 0.65)',
  textMuted:    'rgba(255, 255, 255, 0.38)',
  divider:      'rgba(255, 255, 255, 0.07)',
  hover:        'rgba(255, 255, 255, 0.05)',
  accentBlue:   '#38bdf8',
  accentPurple: '#8b5cf6',
  accentAmber:  '#f59e0b',
  accentGreen:  '#22c55e',
  accentRed:    '#f87171',
}

// ─── Stat card color variants (used by StatCard component) ───────────────────
export const statCardTheme = {
  blue: {
    bg:     'linear-gradient(135deg, rgba(56,189,248,0.13) 0%, rgba(56,189,248,0.06) 100%)',
    border: 'rgba(56,189,248,0.22)',
    icon:   '#38bdf8',
    iconBg: 'rgba(56,189,248,0.18)',
  },
  purple: {
    bg:     'linear-gradient(135deg, rgba(139,92,246,0.13) 0%, rgba(139,92,246,0.06) 100%)',
    border: 'rgba(139,92,246,0.22)',
    icon:   '#8b5cf6',
    iconBg: 'rgba(139,92,246,0.18)',
  },
  amber: {
    bg:     'linear-gradient(135deg, rgba(245,158,11,0.13) 0%, rgba(245,158,11,0.06) 100%)',
    border: 'rgba(245,158,11,0.22)',
    icon:   '#f59e0b',
    iconBg: 'rgba(245,158,11,0.18)',
  },
  green: {
    bg:     'linear-gradient(135deg, rgba(34,197,94,0.13) 0%, rgba(34,197,94,0.06) 100%)',
    border: 'rgba(34,197,94,0.22)',
    icon:   '#22c55e',
    iconBg: 'rgba(34,197,94,0.18)',
  },
}

// ─── Dark status badges (for event/membership status in dark UI) ─────────────
export const darkStatusBadge = {
  DRAFT:        { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af',  border: 'rgba(107,114,128,0.3)' },
  UNDER_REVIEW: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24',  border: 'rgba(251,191,36,0.3)'  },
  APPROVED:     { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80',  border: 'rgba(74,222,128,0.3)'  },
  REJECTED:     { bg: 'rgba(248,113,113,0.15)', color: '#f87171',  border: 'rgba(248,113,113,0.3)' },
  ECR_PENDING:  { bg: 'rgba(251,146,60,0.15)',  color: '#fb923c',  border: 'rgba(251,146,60,0.3)'  },
  CLOSED:       { bg: 'rgba(107,114,128,0.1)',  color: '#6b7280',  border: 'rgba(107,114,128,0.2)' },
  PENDING:      { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24',  border: 'rgba(251,191,36,0.3)'  },
  ACTIVE:       { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80',  border: 'rgba(74,222,128,0.3)'  },
  LEFT:         { bg: 'rgba(107,114,128,0.1)',  color: '#6b7280',  border: 'rgba(107,114,128,0.2)' },
}

// ─── Event lifecycle status badges (light mode Tailwind) ─────────────────────
export const statusBadgeClass = {
  DRAFT:        'bg-gray-100 text-gray-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-800',
  APPROVED:     'bg-green-100 text-green-800',
  REJECTED:     'bg-red-100 text-red-800',
  ECR_PENDING:  'bg-orange-100 text-orange-800',
  CLOSED:       'bg-gray-100 text-gray-500',
}

// ─── Membership status badges ─────────────────────────────────────────────────
export const membershipBadgeClass = {
  ACTIVE:   'bg-green-100 text-green-800',
  PENDING:  'bg-yellow-100 text-yellow-800',
  REJECTED: 'bg-red-100 text-red-700',
  LEFT:     'bg-gray-100 text-gray-600',
}

// ─── Budget status badges ─────────────────────────────────────────────────────
export const budgetStatusClass = {
  DRAFT:     'bg-gray-100 text-gray-700',
  SUBMITTED: 'bg-amber-100 text-amber-800',
  APPROVED:  'bg-green-100 text-green-800',
  REJECTED:  'bg-red-100 text-red-800',
}

// ─── ECR and Settlement status badges ────────────────────────────────────────
export const ecrStatusClass = {
  DRAFT:        'bg-gray-100 text-gray-700',
  SUBMITTED:    'bg-amber-100 text-amber-800',
  APPROVED:     'bg-green-100 text-green-800',
  UNDER_REVIEW: 'bg-amber-100 text-amber-800',
}

// ─── Calendar event pills ─────────────────────────────────────────────────────
export const calendarPillClass = {
  APPROVED:         'bg-green-100 text-green-800 border border-green-200',
  DRAFT:            'bg-gray-100 text-gray-600 border border-gray-200',
  UNDER_REVIEW:     'bg-amber-100 text-amber-800 border border-amber-200',
  REJECTED:         'bg-red-100 text-red-700 border border-red-200',
  ECR_PENDING:      'bg-orange-100 text-orange-800 border border-orange-200',
  CLOSED:           'bg-gray-100 text-gray-400 border border-gray-100',
  APPROVER_PENDING: 'bg-amber-200 text-amber-900 border border-amber-300',
}

// ─── Approval step stepper ────────────────────────────────────────────────────
export const stepDotClass = {
  APPROVED:         'bg-green-500 ring-2 ring-green-200',
  REJECTED:         'bg-red-500 ring-2 ring-red-200',
  PENDING_ACTIVE:   'bg-amber-400 ring-2 ring-amber-200 animate-pulse',
  PENDING_INACTIVE: 'bg-gray-200 ring-2 ring-gray-100',
  SKIPPED:          'bg-gray-100 ring-2 ring-gray-50',
}

export const stepRowClass = {
  APPROVED:         'border-l-4 border-green-400 bg-green-50/40',
  REJECTED:         'border-l-4 border-red-400 bg-red-50/40',
  PENDING_ACTIVE:   'border-l-4 border-amber-400 bg-amber-50/40',
  PENDING_INACTIVE: 'border-l-4 border-gray-200 bg-transparent',
  SKIPPED:          'border-l-4 border-gray-100 bg-transparent opacity-50',
}

// ─── Inline banners ───────────────────────────────────────────────────────────
export const bannerClass = {
  warning: 'border border-amber-200 bg-amber-50 text-amber-800',
  error:   'border border-red-200 bg-red-50 text-red-800',
  success: 'border border-green-200 bg-green-50 text-green-800',
  info:    'border border-blue-200 bg-blue-50 text-blue-800',
}

// ─── Approve / Reject action buttons ─────────────────────────────────────────
export const actionButtonClass = {
  approve: 'text-green-700 border-green-200 hover:bg-green-50',
  reject:  'text-destructive border-destructive/20 hover:bg-destructive/5',
}

// ─── Dark action buttons (dashboard) ─────────────────────────────────────────
export const darkActionBtn = {
  base: {
    border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '500',
    cursor: 'pointer', padding: '6px 12px', fontFamily: 'inherit', transition: 'opacity 0.15s',
  },
  primary: {
    background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
    color: '#fff',
  },
  ghost: {
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.65)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  outline: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.65)',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  danger: {
    background: 'rgba(248,113,113,0.12)',
    color: '#f87171',
    border: '1px solid rgba(248,113,113,0.25)',
  },
  approve: {
    background: 'rgba(74,222,128,0.12)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.25)',
  },
}

// ─── Status indicator dot ─────────────────────────────────────────────────────
export const indicatorDotClass = {
  active:   'bg-amber-400 animate-pulse',
  inactive: 'bg-gray-300',
  success:  'bg-green-500',
  error:    'bg-red-500',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getStepStyleKey(step) {
  if (step.status === 'APPROVED') return 'APPROVED'
  if (step.status === 'REJECTED') return 'REJECTED'
  if (step.status === 'SKIPPED')  return 'SKIPPED'
  if (step.isActive)              return 'PENDING_ACTIVE'
  return 'PENDING_INACTIVE'
}

export function getCalendarPillClass(event) {
  if (event.isApproverPending) return calendarPillClass.APPROVER_PENDING
  return calendarPillClass[event.status] ?? calendarPillClass.APPROVED
}
