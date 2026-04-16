import { Navigate, useParams } from 'react-router-dom'
import { useEventById, useUpdateEvent } from '../hooks/useEvents'
import EventForm from '../components/EventForm'
import Loader from '../../../components/shared/Loader'
import useAuthStore from '../../../store/authStore'

export default function EditEventPage() {
  const { id }  = useParams()
  const store   = useAuthStore()

  const { data: event, isLoading } = useEventById(id)
  const { mutate: updateEvent, isPending } = useUpdateEvent(id)

  const leadClubs = store.getLeadClubs()

  if (isLoading) return <Loader text="Loading event..." />

  if (!event) {
    return (
      <p className="text-muted-foreground text-sm">Event not found.</p>
    )
  }

  // Only DRAFT events can be edited
  if (event.status !== 'DRAFT') {
    return (
      <div className="rounded-lg border bg-card p-6 space-y-2">
        <p className="font-medium text-foreground">Cannot edit this event</p>
        <p className="text-sm text-muted-foreground">
          This event is <strong>{event.status.replace(/_/g, ' ')}</strong> and
          can no longer be edited. Only DRAFT events are editable.
        </p>
      </div>
    )
  }

  // Only the club lead of the organizing club can edit
  const isOrganizer = store.hasRoleInScope('CLUB_LEAD', event.organizingClubId)
  if (!isOrganizer && !store.isAdmin()) {
    return <Navigate to={`/events/${id}`} replace />
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Event</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Changes are only allowed while the event is in DRAFT status.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <EventForm
          initialValues={event}
          leadClubs={leadClubs}
          onSubmit={(payload) => updateEvent(payload)}
          isSubmitting={isPending}
        />
      </div>
    </div>
  )
}