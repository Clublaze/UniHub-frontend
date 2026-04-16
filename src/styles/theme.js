// ─── Single source of truth for all status colors ────────────────────────────
// Rule: never write color class names directly in components.
// Import the right map here and do: const cls = map[status]

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

// ─── Event lifecycle status badges ───────────────────────────────────────────
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
// Used in MonthView and WeekView event pills
export const calendarPillClass = {
  APPROVED:         'bg-green-100 text-green-800 border border-green-200',
  DRAFT:            'bg-gray-100 text-gray-600 border border-gray-200',
  UNDER_REVIEW:     'bg-amber-100 text-amber-800 border border-amber-200',
  REJECTED:         'bg-red-100 text-red-700 border border-red-200',
  ECR_PENDING:      'bg-orange-100 text-orange-800 border border-orange-200',
  CLOSED:           'bg-gray-100 text-gray-400 border border-gray-100',
  // Special: approver has an active step for this event
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getStepStyleKey(step) {
  if (step.status === 'APPROVED') return 'APPROVED'
  if (step.status === 'REJECTED') return 'REJECTED'
  if (step.status === 'SKIPPED')  return 'SKIPPED'
  if (step.isActive)              return 'PENDING_ACTIVE'
  return 'PENDING_INACTIVE'
}

// Returns the right calendar pill class for an event
// isApproverPending = true means this user has an active step on this event
export function getCalendarPillClass(event) {
  if (event.isApproverPending) return calendarPillClass.APPROVER_PENDING
  return calendarPillClass[event.status] ?? calendarPillClass.APPROVED
}