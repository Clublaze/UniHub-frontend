import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Tag } from 'lucide-react'
import { usePublicEventDetail } from '../hooks/useExplore'
import StatusBadge from '../../../components/shared/StatusBadge'
import Loader from '../../../components/shared/Loader'
import { Separator } from '../../../components/ui/separator'
import { formatDate } from '../../../utils/date.util'

export default function ExploreEventDetailPage() {
  const { id } = useParams()
  const { data: event, isLoading } = usePublicEventDetail(id)

  if (isLoading) return <Loader text="Loading event..." />
  if (!event)    return <p className="text-muted-foreground">Event not found.</p>

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/explore/events"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to events
      </Link>

      {event.attachments?.poster && (
        <img
          src={event.attachments.poster}
          alt={event.title}
          className="w-full max-h-72 object-cover rounded-lg"
        />
      )}

      {/* Title + status */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
          <StatusBadge status={event.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {event.organizingClubName} · {event.category?.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Key info grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-lg border bg-card p-4">
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              {formatDate(event.startDate, { weekday: 'long' })}
            </p>
            {event.startDate !== event.endDate && (
              <p className="text-muted-foreground text-xs">
                to {formatDate(event.endDate)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-foreground">{event.venue}</span>
        </div>

        {event.expectedParticipants && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">
              {event.expectedParticipants} expected participants
            </span>
          </div>
        )}

        {event.targetAudience && (
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">{event.targetAudience}</span>
          </div>
        )}
      </div>

      <Separator />

      {event.description && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>
      )}

      {event.objective && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">Objective</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.objective}
          </p>
        </div>
      )}

      {event.guestSpeakers?.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Guest Speakers
          </h2>
          <div className="space-y-1.5">
            {event.guestSpeakers.map((g, i) => (
              <p key={i} className="text-sm">
                <span className="font-medium text-foreground">{g.name}</span>
                {g.affiliation && (
                  <span className="text-muted-foreground"> · {g.affiliation}</span>
                )}
                {g.role && (
                  <span className="text-muted-foreground"> ({g.role})</span>
                )}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}