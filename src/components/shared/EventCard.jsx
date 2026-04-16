// Shared — used in explore pages AND dashboard UpcomingEventsWidget
// linkPrefix lets you control where clicking goes:
//   explore context  → /explore/events/:id
//   dashboard context → /events/:id  (Phase 5)
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../utils/date.util'

export default function EventCard({ event, linkPrefix = '/explore/events' }) {
  return (
    <Link to={`${linkPrefix}/${event._id}`}>
      <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
        <CardContent className="p-4 space-y-3">
          {/* Poster image or fallback */}
          {event.attachments?.poster ? (
            <img
              src={event.attachments.poster}
              alt={event.title}
              className="w-full h-36 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-36 rounded-md bg-muted flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
                {event.title}
              </h3>
              {event.status && <StatusBadge status={event.status} />}
            </div>

            <p className="text-xs text-muted-foreground">
              {event.organizingClubName || ''}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(event.startDate)}
              </span>
              {event.venue && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3" />
                  {event.venue}
                </span>
              )}
            </div>

            {event.expectedParticipants && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {event.expectedParticipants} expected
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}