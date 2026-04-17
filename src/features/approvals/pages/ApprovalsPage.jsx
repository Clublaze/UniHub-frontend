// Shows all pending approval steps for the logged-in approver.
// "Review →" links to the event detail page where the action form lives
// inside the Approvals tab — no duplicate approve/reject UI here.
import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { useApprovalsDashboard } from '../hooks/useApprovalsPage'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { indicatorDotClass } from '../../../styles/theme'
import { timeAgo } from '../../../utils/date.util'
import useAuthStore from '../../../store/authStore'

// Groups steps by eventId so that multiple steps for the same event
// (parallel approval) appear as one group
function groupByEvent(steps) {
  const map = {}
  steps.forEach(step => {
    const key = step.eventId
    if (!map[key]) map[key] = []
    map[key].push(step)
  })
  return Object.values(map)
}

export default function ApprovalsPage() {
  const store = useAuthStore()
  const { data: steps = [], isLoading } = useApprovalsDashboard()

  // Guard — this page should never be reachable for non-approvers
  // (sidebar hides it), but add a safety net just in case
  if (!store.isApprover()) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          You do not have access to the approvals dashboard.
        </p>
      </div>
    )
  }

  if (isLoading) return <Loader text="Loading pending approvals..." />

  const groups = groupByEvent(steps)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Events requiring your action as{' '}
            {store.roles
              .filter(r => r.status === 'ACTIVE')
              .map(r => r.displayRoleName || r.canonicalRole)
              .join(', ')}
          </p>
        </div>
        {steps.length > 0 && (
          <Badge className="text-sm px-3 py-1">
            {steps.length} pending
          </Badge>
        )}
      </div>

      {/* Empty state */}
      {groups.length === 0 ? (
        <div className="rounded-lg border bg-card p-16 text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground">
            No events are pending your approval right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            // All steps in a group share the same eventId and eventTitle
            const firstStep   = group[0]
            const eventId     = firstStep.eventId
            const eventTitle  = firstStep.eventTitle  || 'Unnamed Event'
            const clubName    = firstStep.organizingClubName || ''

            return (
              <div
                key={eventId}
                className="rounded-lg border bg-card overflow-hidden"
              >
                {/* Event header row */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">
                      {eventTitle}
                    </p>
                    {clubName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {clubName}
                      </p>
                    )}
                  </div>
                  {/* Deep-link to the Approvals tab on the event detail page */}
                  <Link to={`/events/${eventId}#approvals`}>
                    <Button size="sm" className="ml-4 shrink-0">
                      Review & Decide
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {/* Step rows inside this event */}
                <div className="divide-y">
                  {group.map((step) => (
                    <div
                      key={step._id}
                      className="flex items-center justify-between px-5 py-3 gap-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm text-foreground">
                          Step {step.stepOrder} —{' '}
                          <span className="font-medium">{step.canonicalRole}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.assignedToName || 'Assigned to you'}
                          {step.createdAt && ` · ${timeAgo(step.createdAt)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {step.stepType === 'PARALLEL' && (
                          <Badge variant="outline" className="text-xs">
                            Parallel
                          </Badge>
                        )}
                        {/* Pulsing dot — uses inline style, not a status color class */}
                        <div className={`h-2.5 w-2.5 rounded-full ${indicatorDotClass.active}`} />
                        <span className="text-xs text-muted-foreground">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
