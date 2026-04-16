import { Navigate } from 'react-router-dom'
import { useCreateEvent } from '../hooks/useEvents'
import EventForm from '../components/EventForm'
import useAuthStore from '../../../store/authStore'

export default function CreateEventPage() {
  const store     = useAuthStore()
  const leadClubs = store.getLeadClubs()

  // Hard guard — no lead clubs means no access
  if (leadClubs.length === 0) {
    return <Navigate to="/dashboard" replace />
  }

  const { mutate: createEvent, isPending } = useCreateEvent()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Event</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details. You can submit for approval once the budget is ready.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <EventForm
          leadClubs={leadClubs}
          onSubmit={(payload) => createEvent(payload)}
          isSubmitting={isPending}
        />
      </div>
    </div>
  )
}