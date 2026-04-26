// Shows pending approval work for the logged-in approver.
// Event steps link to the Approvals tab; budget requests link to the Budget tab.
import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle } from 'lucide-react'
import { useApprovalsDashboard } from '../hooks/useApprovalsPage'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { indicatorDotClass } from '../../../styles/theme'
import { timeAgo } from '../../../utils/date.util'
import useAuthStore from '../../../store/authStore'

function groupByEvent(items) {
  const map = {}
  items.forEach(item => {
    const key = item.eventId
    if (!map[key]) map[key] = []
    map[key].push(item)
  })
  return Object.values(map)
}

function isBudgetItem(item) {
  return item.itemType === 'BUDGET'
}

export default function ApprovalsPage() {
  const store = useAuthStore()
  const { data: items = [], isLoading } = useApprovalsDashboard()

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

  const groups = groupByEvent(items)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Events and budgets requiring your action as{' '}
            {store.roles
              .filter(r => r.status === 'ACTIVE')
              .map(r => r.displayRoleName || r.canonicalRole)
              .join(', ')}
          </p>
        </div>
        {items.length > 0 && (
          <Badge className="text-sm px-3 py-1">
            {items.length} pending
          </Badge>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-lg border bg-card p-16 text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground">
            No events or budgets are pending your approval right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const firstItem   = group[0]
            const budgetItem  = group.find(isBudgetItem)
            const eventId     = firstItem.eventId
            const eventTitle  = firstItem.eventTitle  || 'Unnamed Event'
            const clubName    = firstItem.organizingClubName || ''
            const reviewHash  = budgetItem ? 'budget' : 'approvals'
            const reviewLabel = budgetItem ? 'Review Budget' : 'Review & Decide'

            return (
              <div
                key={eventId}
                className="rounded-lg border bg-card overflow-hidden"
              >
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
                  <Link to={`/events/${eventId}#${reviewHash}`}>
                    <Button size="sm" className="ml-4 shrink-0">
                      {reviewLabel}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="divide-y">
                  {group.map((item) => {
                    const isBudget = isBudgetItem(item)
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between px-5 py-3 gap-4"
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm text-foreground">
                            {isBudget ? (
                              <>
                                Budget approval{' '}
                                <span className="font-medium">Rs. {(item.proposedExpense ?? 0).toLocaleString()}</span>
                              </>
                            ) : (
                              <>
                                Step {item.stepOrder} -{' '}
                                <span className="font-medium">{item.canonicalRole}</span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isBudget ? 'Pre-event budget awaiting approval' : (item.assignedToName || 'Assigned to you')}
                            {item.createdAt && ` - ${timeAgo(item.createdAt)}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isBudget && (
                            <Badge variant="outline" className="text-xs">
                              Budget
                            </Badge>
                          )}
                          {!isBudget && item.stepType === 'PARALLEL' && (
                            <Badge variant="outline" className="text-xs">
                              Parallel
                            </Badge>
                          )}
                          <div className={`h-2.5 w-2.5 rounded-full ${indicatorDotClass.active}`} />
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
