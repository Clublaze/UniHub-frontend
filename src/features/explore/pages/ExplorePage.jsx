// Hub page — shows a preview of clubs, events, and societies
// Each section has a "View All" link to the full page
import { Link } from 'react-router-dom'
import { usePublicClubs, usePublicSocieties, usePublicEvents } from '../hooks/useExplore'
import ClubCard from '../components/ClubCard'
import SocietyCard from '../components/SocietyCard'
import EventCard from '../../../components/shared/EventCard'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'

// Safely extract array from either a plain array or a paginated response
const toList = (data) => (Array.isArray(data) ? data : data?.data ?? [])

export default function ExplorePage() {
  const { data: clubData,    isLoading: loadingClubs    } = usePublicClubs({ limit: 6 })
  const { data: societyData, isLoading: loadingSocieties } = usePublicSocieties()
  const { data: eventData,   isLoading: loadingEvents   } = usePublicEvents({ limit: 4 })

  const clubs     = toList(clubData)
  const societies = toList(societyData)
  const events    = toList(eventData)

  return (
    <div className="space-y-10">

      {/* Clubs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Clubs</h2>
          <Link to="/explore/clubs">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {loadingClubs ? (
          <Loader />
        ) : clubs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clubs available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.slice(0, 6).map(club => (
              <ClubCard key={club._id} club={club} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
          <Link to="/explore/events">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {loadingEvents ? (
          <Loader />
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.slice(0, 4).map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Societies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Societies</h2>
          <Link to="/explore/societies">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        {loadingSocieties ? (
          <Loader />
        ) : societies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No societies found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {societies.slice(0, 6).map(s => (
              <SocietyCard key={s._id} society={s} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}