// One panel per club the user leads
// Props: clubId, clubName
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Users, ExternalLink } from 'lucide-react'
import {
  getClubEventsApi, submitEventApi, completeEventApi,
} from '../../events/events.api'
import { getPendingMembershipsApi } from '../../memberships/memberships.api'
import StatusBadge from '../../../components/shared/StatusBadge'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { formatDate } from '../../../utils/date.util'

export default function ClubLeadPanel({ clubId, clubName }) {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data: eventsData, isLoading: loadingEvents } = useQuery({
    queryKey: ['events', 'club', clubId],
    queryFn:  () => getClubEventsApi(clubId, { limit: 5 }),
    select:   (res) => {
      const d = res.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    },
  })

  const { data: pendingData } = useQuery({
    queryKey: ['memberships', 'pending', clubId],
    queryFn:  () => getPendingMembershipsApi(clubId).then(r => {
      const d = r.data.data
      return Array.isArray(d) ? d : (d?.data ?? [])
    }),
  })

  const events  = eventsData  ?? []
  const pending = pendingData ?? []

  const submitMutation = useMutation({
    mutationFn: (eventId) => submitEventApi(eventId),
    onSuccess:  () => {
      toast.success('Event submitted for approval!')
      qc.invalidateQueries({ queryKey: ['events', 'club', clubId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to submit event.'),
  })

  const completeMutation = useMutation({
    mutationFn: (eventId) => completeEventApi(eventId),
    onSuccess:  () => {
      toast.success('Event marked as complete. ECR now required.')
      qc.invalidateQueries({ queryKey: ['events', 'club', clubId] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to mark complete.'),
  })

  // Action buttons per event status — Phase 5 will add full detail pages
  // For now: navigate or call mutation directly from dashboard
  const ActionButtons = ({ event }) => {
    switch (event.status) {
      case 'DRAFT':
        return (
          <div className="flex gap-1.5">
            <Button
              size="sm" variant="outline"
              onClick={() => navigate(`/events/${event._id}/edit`)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              onClick={() => submitMutation.mutate(event._id)}
              disabled={submitMutation.isPending}
            >
              Submit
            </Button>
          </div>
        )
      case 'UNDER_REVIEW':
        return (
          <Button size="sm" variant="ghost" onClick={() => navigate(`/events/${event._id}`)}>
            View
          </Button>
        )
      case 'REJECTED':
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/events/${event._id}`)}>
              View
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate(`/events/${event._id}/edit`)}>
              Resubmit
            </Button>
          </div>
        )
      case 'APPROVED':
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/events/${event._id}`)}>
              View
            </Button>
            <Button
              size="sm"
              onClick={() => completeMutation.mutate(event._id)}
              disabled={completeMutation.isPending}
            >
              Mark Complete
            </Button>
          </div>
        )
      case 'ECR_PENDING':
        return (
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" onClick={() => navigate(`/events/${event._id}`)}>
              Submit ECR
            </Button>
          </div>
        )
      case 'CLOSED':
        return (
          <Button size="sm" variant="ghost" onClick={() => navigate(`/events/${event._id}`)}>
            View
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h2 className="font-semibold text-foreground">{clubName}</h2>
        <div className="flex items-center gap-2">
          {pending.length > 0 && (
            <Link to={`/clubs/${clubId}/members`}>
              <Badge
                variant="secondary"
                className="cursor-pointer flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                {pending.length} pending
              </Badge>
            </Link>
          )}
          <Link to={`/clubs/${clubId}`}>
            <Button size="sm" variant="ghost">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 px-5 py-3 border-b bg-muted/30">
        <Link to="/events/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create Event
          </Button>
        </Link>
        <Link to={`/clubs/${clubId}/members`}>
          <Button size="sm" variant="outline">
            <Users className="h-4 w-4 mr-1" />
            Manage Members
          </Button>
        </Link>
      </div>

      {/* Events list */}
      {loadingEvents ? (
        <div className="p-4">
          <Loader size="sm" />
        </div>
      ) : events.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No events yet.{' '}
            <Link to="/events/new" className="underline text-foreground">
              Create one
            </Link>
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {events.map(event => (
            <div
              key={event._id}
              className="flex items-center justify-between px-5 py-3 gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(event.startDate)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={event.status} />
                <ActionButtons event={event} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}