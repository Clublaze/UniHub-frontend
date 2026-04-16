import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import {
  useEventById,
  useSubmitEvent,
  useResubmitEvent,
  useCompleteEvent,
} from '../hooks/useEvents'
import { useBudget } from '../hooks/useBudget'
import DetailsTab    from '../components/tabs/DetailsTab'
import BudgetTab     from '../components/tabs/BudgetTab'
import ApprovalsTab  from '../components/tabs/ApprovalsTab'
import EcrTab        from '../components/tabs/EcrTab'
import SettlementTab from '../components/tabs/SettlementTab'
import StatusBadge   from '../../../components/shared/StatusBadge'
import Loader        from '../../../components/shared/Loader'
import { Button }    from '../../../components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs'
import { bannerClass } from '../../../styles/theme'
import useAuthStore from '../../../store/authStore'

// Map specific backend 400 messages to user-friendly text
function parseSubmitError(err) {
  const msg = (err?.response?.data?.message || '').toLowerCase()
  if (msg.includes('governance') || msg.includes('no active governance'))
    return "This club doesn't have an approval workflow configured yet. Contact your Faculty Advisor or Admin to set it up."
  if (msg.includes('no one') || msg.includes('unfilled') || msg.includes('role'))
    return 'A required role in the approval chain is currently unfilled. An Admin must assign it before you can submit.'
  if (msg.includes('budget'))
    return 'Your budget must be submitted and approved before you can submit this event.'
  return err?.response?.data?.message || 'Failed to submit the event. Please try again.'
}

export default function EventDetailPage() {
  const { id }   = useParams()
  const store    = useAuthStore()

  const { data: event, isLoading } = useEventById(id)

  // Fetch budget proactively — needed for the submit gate check
  // retry: false is set inside useBudget so 404 is treated as "no budget yet"
  const { data: budget } = useBudget(id)

  const { mutate: submitEvent,   isPending: submitting   } = useSubmitEvent(id)
  const { mutate: resubmitEvent, isPending: resubmitting } = useResubmitEvent(id)
  const { mutate: completeEvent, isPending: completing   } = useCompleteEvent(id)

  const [submitError, setSubmitError] = useState('')

  // Role checks
  const isOrganizer       = event
    ? store.hasRoleInScope('CLUB_LEAD', event.organizingClubId)
    : false
  const isApprover        = store.isApprover()
  const isFacultyApprover = store.isFacultyApprover()
  const canApproveBudget  =
    isFacultyApprover ||
    store.hasRole('SECRETARY') ||
    store.hasRole('PRESIDENT')
  const isAdmin           = store.isAdmin()
  const currentUserId     = store.user?.id

  // ECR and Settlement tabs only appear after event is completed
  const showEcrTabs = event &&
    ['ECR_PENDING', 'CLOSED'].includes(event.status)

  // Proactive budget gate — prevents a wasted API round-trip on submit
  const getBudgetBlock = () => {
    if (!budget)
      return 'You need to submit a budget before submitting this event. Go to the Budget tab.'
    if (budget.status === 'DRAFT')
      return 'Your budget is still a draft. Submit it first in the Budget tab.'
    if (budget.status === 'SUBMITTED')
      return 'Your budget is awaiting approval. You can submit the event once the budget is approved.'
    if (budget.status === 'REJECTED')
      return 'Your budget was rejected. Please revise and resubmit it before submitting the event.'
    return null // APPROVED — safe to proceed
  }

  const handleSubmit = () => {
    setSubmitError('')
    const blockReason = getBudgetBlock()
    if (blockReason) {
      setSubmitError(blockReason)
      return
    }
    submitEvent(undefined, {
      onSuccess: () => setSubmitError(''),
      onError:   (err) => setSubmitError(parseSubmitError(err)),
    })
  }

  const handleResubmit = () => {
    // Resubmit resets the event back to DRAFT so the user can edit and re-submit
    resubmitEvent()
  }

  if (isLoading) return <Loader text="Loading event..." />
  if (!event)    return <p className="text-sm text-muted-foreground">Event not found.</p>

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Back navigation */}
      <Link
        to="/events"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      {/* Page header */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
          <StatusBadge status={event.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {event.organizingClubName}
          {event.category && ` · ${event.category.replace(/_/g, ' ')}`}
        </p>
      </div>

      {/* Inline error banner — prominent, not a dismissible toast */}
      {submitError && (
        <div className={`rounded-md p-3 text-sm flex items-start gap-2 ${bannerClass.warning}`}>
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Action bar — evaluates status + role in order */}
      <div className="flex flex-wrap gap-2 min-h-[36px]">

        {/* DRAFT — club lead can edit and submit */}
        {isOrganizer && event.status === 'DRAFT' && (
          <>
            <Link to={`/events/${id}/edit`}>
              <Button variant="outline">Edit Event</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </>
        )}

        {/* UNDER_REVIEW — no actions for club lead */}
        {isOrganizer && event.status === 'UNDER_REVIEW' && (
          <p className="text-sm text-muted-foreground self-center">
            This event is currently under review. No actions are available.
          </p>
        )}

        {/* REJECTED — club lead can resubmit (goes back to DRAFT first) */}
        {isOrganizer && event.status === 'REJECTED' && (
          <>
            {event.rejectionReason && (
              <div className={`w-full rounded-md p-3 text-sm ${bannerClass.error}`}>
                <span className="font-medium">Rejection reason: </span>
                {event.rejectionReason}
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleResubmit}
              disabled={resubmitting}
            >
              {resubmitting ? 'Processing...' : 'Edit & Resubmit'}
            </Button>
          </>
        )}

        {/* APPROVED — club lead marks complete */}
        {isOrganizer && event.status === 'APPROVED' && (
          <Button onClick={() => completeEvent()} disabled={completing}>
            {completing ? 'Processing...' : 'Mark as Complete'}
          </Button>
        )}

        {/* ECR_PENDING — remind club lead what's needed */}
        {isOrganizer && event.status === 'ECR_PENDING' && (
          <p className="text-sm text-muted-foreground self-center">
            Please submit the ECR and Settlement using the tabs below.
          </p>
        )}

        {/* CLOSED — no actions */}
        {isOrganizer && event.status === 'CLOSED' && (
          <p className="text-sm text-muted-foreground self-center">
            This event has been fully closed.
          </p>
        )}

        {/* Read-only notice for non-organizers */}
        {!isOrganizer && !isApprover && !isAdmin && (
          <p className="text-sm text-muted-foreground self-center">
            You are viewing this event in read-only mode.
          </p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          {showEcrTabs && <TabsTrigger value="ecr">ECR</TabsTrigger>}
          {showEcrTabs && <TabsTrigger value="settlement">Settlement</TabsTrigger>}
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <DetailsTab event={event} />
        </TabsContent>

        <TabsContent value="budget" className="mt-4">
          <BudgetTab
            eventId={id}
            canSubmit={isOrganizer}
            canApprove={canApproveBudget}
            isAdmin={isAdmin}
          />
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <ApprovalsTab
            eventId={id}
            currentUserId={currentUserId}
            isApprover={isApprover}
          />
        </TabsContent>

        {showEcrTabs && (
          <TabsContent value="ecr" className="mt-4">
            <EcrTab
              eventId={id}
              canSubmit={isOrganizer}
              canApprove={isFacultyApprover}
              isAdmin={isAdmin}
            />
          </TabsContent>
        )}

        {showEcrTabs && (
          <TabsContent value="settlement" className="mt-4">
            <SettlementTab
              eventId={id}
              canSubmit={isOrganizer}
              canApprove={isFacultyApprover}
              isAdmin={isAdmin}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}