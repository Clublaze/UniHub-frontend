// Shown to SECRETARY / VP / PRESIDENT / FACULTY_ADVISOR / HOD / DEAN
// Lists pending approval steps assigned to this user
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getApprovalsDashboardApi } from '../../approvals/approvals.api'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'

export default function ApproverWidget() {
  const { data: steps = [], isLoading } = useQuery({
    queryKey: ['approvals', 'dashboard'],
    queryFn:  () => getApprovalsDashboardApi().then(r => r.data.data ?? []),
    staleTime: 1000 * 60 * 2,
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Pending Approvals
          {steps.length > 0 && (
            <Badge className="ml-2 h-5 px-1.5 text-xs">{steps.length}</Badge>
          )}
        </h2>
        <Link to="/approvals">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All →
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : steps.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              ✅ You're all caught up. No pending approvals.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {steps.slice(0, 5).map((step, i) => (
              <Link
                key={step._id || i}
                to={`/events/${step.eventId}#approvals`}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {step.eventTitle || 'Event'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {step.organizingClubName || 'Club'} · Step {step.stepOrder} · {step.canonicalRole}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}