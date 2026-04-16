// Colors come from StatusBadge → theme.js
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import StatusBadge from '../../../components/shared/StatusBadge'
import { formatDate } from '../../../utils/date.util'

// Groups events by "Month Year" label
function groupByMonth(events) {
  const groups = {}
  const sorted = [...events].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  )
  sorted.forEach(e => {
    const d     = new Date(e.startDate)
    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    if (!groups[label]) groups[label] = []
    groups[label].push(e)
  })
  return groups
}

export default function ListView({ events, filters }) {
  const filtered = events.filter(e => {
    if (filters.status && filters.status !== 'ALL' && e.status !== filters.status) return false
    if (!e.startDate) return false
    return true
  })

  const groups = groupByMonth(filtered)
  const months = Object.keys(groups)

  if (months.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No events found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {months.map(month => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {month}
          </h3>
          <div className="space-y-2">
            {groups[month].map(event => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="block rounded-lg border bg-card p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground truncate">
                        {event.isApproverPending && '⚡ '}
                        {event.title}
                      </p>
                      <StatusBadge status={event.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {event.organizingClubName}
                      {event.category && ` · ${event.category.replace(/_/g, ' ')}`}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate &&
                          ` – ${formatDate(event.endDate)}`}
                      </span>
                      {event.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.venue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}