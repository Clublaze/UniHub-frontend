// Dialog that opens when user clicks an event pill on the calendar
// All status colors via StatusBadge → theme.js
import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import StatusBadge from '../../../components/shared/StatusBadge'
import { formatDate } from '../../../utils/date.util'

export default function EventPopup({ event, onClose }) {
  if (!event) return null

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug pr-4">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={event.status} />
            {event.category && (
              <span className="text-xs text-muted-foreground">
                {event.category.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {event.organizingClubName && (
            <p className="text-sm text-muted-foreground">
              {event.organizingClubName}
            </p>
          )}

          <div className="space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {formatDate(event.startDate)}
                {event.endDate && event.endDate !== event.startDate &&
                  ` → ${formatDate(event.endDate)}`}
              </span>
            </div>
            {event.venue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{event.venue}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              to={`/events/${event._id}`}
              onClick={onClose}
              className="flex-1"
            >
              <Button size="sm" className="w-full">
                View Full Event →
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}