import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useEventsList } from '../hooks/useEvents'
import StatusBadge from '../../../components/shared/StatusBadge'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import useAuthStore from '../../../store/authStore'
import { formatDate } from '../../../utils/date.util'

const STATUSES = [
  'ALL', 'DRAFT', 'UNDER_REVIEW', 'APPROVED',
  'REJECTED', 'ECR_PENDING', 'CLOSED',
]

// Sentinel value used instead of empty string — Radix UI Select crashes on value=""
const ALL_CLUBS = '__ALL_CLUBS__'

export default function EventsListPage() {
  const store     = useAuthStore()
  const leadClubs = store.getLeadClubs()
  const isAdmin   = store.isAdmin()

  const [status, setStatus] = useState('ALL')
  const [clubId, setClubId] = useState(
    leadClubs.length === 1 ? leadClubs[0].scopeId : ALL_CLUBS
  )
  const [search, setSearch] = useState('')
  const [page,   setPage]   = useState(1)

  // Convert sentinel back to empty string for the API call
  const realClubId = clubId === ALL_CLUBS ? '' : clubId

  const queryParams = {
    ...(status !== 'ALL' ? { status }         : {}),
    ...(realClubId       ? { clubId: realClubId } : {}),
    page,
    limit: 20,
  }

  const { data, isLoading } = useEventsList(queryParams)
  const events     = data?.data  ?? []
  const total      = data?.total ?? 0
  const totalPages = Math.ceil(total / 20) || 1

  const filtered = events.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase())
  )

  const canCreate = leadClubs.length > 0

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? 'All events university-wide' : 'Events for your clubs'}
          </p>
        </div>
        {canCreate && (
          <Link to="/events/new">
            <Button>
              <Plus className="h-4 w-4 mr-1.5" /> Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={status}
          onValueChange={v => { setStatus(v); setPage(1) }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Only show when user manages multiple clubs or is admin */}
        {(leadClubs.length > 1 || isAdmin) && (
          <Select
            value={clubId}
            onValueChange={v => { setClubId(v); setPage(1) }}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="All clubs" />
            </SelectTrigger>
            <SelectContent>
              {/* Use sentinel value — Radix crashes on value="" */}
              <SelectItem value={ALL_CLUBS}>All clubs</SelectItem>
              {leadClubs.map(c => (
                <SelectItem key={c.scopeId} value={c.scopeId}>
                  {c.scopeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <Loader text="Loading events..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center space-y-3">
          <p className="text-muted-foreground text-sm">No events found.</p>
          {canCreate && (
            <Link to="/events/new">
              <Button size="sm">Create your first event</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Event', 'Club', 'Category', 'Status', 'Start Date', ''].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-medium text-muted-foreground text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(event => (
                  <tr
                    key={event._id}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate max-w-48">
                        {event.title}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {event.organizingClubName || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {event.category?.replace(/_/g, ' ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {event.startDate ? formatDate(event.startDate) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/events/${event._id}`}>
                        <Button size="sm" variant="ghost">View →</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline" size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline" size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}