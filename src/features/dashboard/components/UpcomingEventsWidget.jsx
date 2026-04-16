// Everyone sees this — shows 4 upcoming public approved events
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getPublicEventsApi } from '../../explore/explore.api'
import EventCard from '../../../components/shared/EventCard'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'

export default function UpcomingEventsWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['discover', 'events', { limit: 4 }],
    queryFn:  () => getPublicEventsApi({ limit: 4 }),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    },
    staleTime: 1000 * 60 * 5,
  })

  const events = data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
        <Link to="/explore/events">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All →
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : events.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}