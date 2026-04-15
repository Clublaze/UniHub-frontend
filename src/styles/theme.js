// All app colors in one place.
// These match the CSS variables shadcn sets up in index.css.
// Use these whenever you need a color in JS (charts, dynamic styles, etc.)
// For normal JSX — use Tailwind classes (bg-primary, text-destructive, etc.)
// For JS/inline styles — use these constants.

export const colors = {
  // Brand
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',

  // Backgrounds
  background: 'hsl(var(--background))',
  card: 'hsl(var(--card))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',

  // Text
  foreground: 'hsl(var(--foreground))',

  // Status — used across event badges, calendar pills, etc.
  status: {
    draft: '#6b7280',         // grey
    underReview: '#d97706',   // amber
    approved: '#16a34a',      // green
    rejected: '#dc2626',      // red
    ecrPending: '#ea580c',    // orange
    closed: '#9ca3af',        // grey muted
  },

  // Borders
  border: 'hsl(var(--border))',
  destructive: 'hsl(var(--destructive))',
  success: '#16a34a',
  warning: '#d97706',
}

// Event status → Tailwind badge classes (use in JSX directly)
export const statusBadgeClass = {
  DRAFT: 'bg-gray-100 text-gray-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ECR_PENDING: 'bg-orange-100 text-orange-800',
  CLOSED: 'bg-gray-100 text-gray-500',
}

// Membership status → Tailwind badge classes
export const membershipBadgeClass = {
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  REJECTED: 'bg-red-100 text-red-700',
  LEFT: 'bg-gray-100 text-gray-600',
}