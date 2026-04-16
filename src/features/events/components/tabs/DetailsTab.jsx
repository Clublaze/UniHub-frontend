import { Calendar, MapPin, Users, Tag, FileText, ExternalLink } from 'lucide-react'
import { Badge } from '../../../../components/ui/badge'
import { Separator } from '../../../../components/ui/separator'
import { formatDate } from '../../../../utils/date.util'

export default function DetailsTab({ event }) {
  if (!event) return null

  const hasDocuments =
    event.attachments?.proposal ||
    event.attachments?.runOfShow ||
    event.attachments?.poster

  return (
    <div className="space-y-6">

      {/* Key info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border bg-card p-4">

        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              {formatDate(event.startDate)}
            </p>
            {event.endDate && event.endDate !== event.startDate && (
              <p className="text-xs text-muted-foreground">
                to {formatDate(event.endDate)}
              </p>
            )}
          </div>
        </div>

        {event.venue && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">{event.venue}</span>
          </div>
        )}

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

      {event.description && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1.5">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>
      )}

      {event.objective && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1.5">Objective</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.objective}
          </p>
        </div>
      )}

      {event.guestSpeakers?.filter(g => g.name).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Guest Speakers</h3>
          <div className="space-y-1.5">
            {event.guestSpeakers.filter(g => g.name).map((g, i) => (
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

      {event.sponsors?.filter(s => s.name).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Sponsors</h3>
          <div className="flex flex-wrap gap-2">
            {event.sponsors.filter(s => s.name).map((s, i) => (
              <Badge key={i} variant="secondary">
                {s.name} · {s.type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Documents</h3>
        {!hasDocuments ? (
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {event.attachments?.proposal && (
              <a
                href={event.attachments.proposal}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                Event Proposal
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {event.attachments?.runOfShow && (
              <a
                href={event.attachments.runOfShow}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                Run of Show
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {event.attachments?.poster && (
              <a
                href={event.attachments.poster}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                Event Poster
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
