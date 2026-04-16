import { useState } from 'react'
import { usePublicEvents } from '../hooks/useExplore'
import EventCard from '../../../components/shared/EventCard'
import Loader from '../../../components/shared/Loader'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../../../components/ui/select'

const CATEGORIES = [
  'ALL', 'WORKSHOP', 'SEMINAR', 'HACKATHON', 'COMPETITION',
  'CULTURAL', 'GUEST_LECTURE', 'FDP', 'WEBINAR', 'INDUSTRIAL_VISIT', 'OTHER',
]

const toList = (data) => (Array.isArray(data) ? data : data?.data ?? [])

export default function ExploreEventsPage() {
  const [category, setCategory] = useState('ALL')
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)

  const { data, isLoading } = usePublicEvents({
    category: category !== 'ALL' ? category : undefined,
    page,
    limit: 12,
  })

  const events     = toList(data)
  const totalPages = Math.ceil((data?.total ?? events.length) / 12)

  const filtered = events.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upcoming Events</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All approved events across university clubs
        </p>
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
          value={category}
          onValueChange={v => { setCategory(v); setPage(1) }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c}>
                {c.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Loader text="Loading events..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No events found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(event => <EventCard key={event._id} event={event} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
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