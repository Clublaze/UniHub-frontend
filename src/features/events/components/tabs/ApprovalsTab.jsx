// All step colors come from theme.js via ApprovalStepper — no color classes here
import { useState } from 'react'
import { useApprovalHistory, useApproveStep, useRejectStep } from '../../hooks/useApprovals'
import ApprovalStepper from '../ApprovalStepper'
import Loader from '../../../../components/shared/Loader'
import { Button } from '../../../../components/ui/button'
import { Textarea } from '../../../../components/ui/textarea'
import { Label } from '../../../../components/ui/label'
import { Separator } from '../../../../components/ui/separator'

export default function ApprovalsTab({ eventId, currentUserId, isApprover }) {
  const { data: steps = [], isLoading } = useApprovalHistory(eventId)

  const { mutate: approveStep, isPending: approving } = useApproveStep(eventId)
  const { mutate: rejectStep,  isPending: rejecting  } = useRejectStep(eventId)

  const [comments,     setComments]    = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showReject,   setShowReject]  = useState(false)

  // The step assigned to this approver that is currently active
  const myStep = isApprover
    ? steps.find(
        s =>
          s.assignedTo === currentUserId &&
          s.isActive &&
          s.status === 'PENDING'
      )
    : null

  const handleApprove = () => {
    approveStep(
      { stepId: myStep._id, comments: comments.trim() },
      { onSuccess: () => setComments('') }
    )
  }

  const handleReject = () => {
    if (rejectReason.trim().length < 5) return
    rejectStep(
      { stepId: myStep._id, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setShowReject(false)
          setRejectReason('')
        },
      }
    )
  }

  if (isLoading) return <Loader />

  return (
    <div className="space-y-6">

      {/* Stepper */}
      {steps.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No approval steps yet. Submit the event first.
          </p>
        </div>
      ) : (
        <ApprovalStepper steps={steps} />
      )}

      {/* Action form — only if this approver has an active step */}
      {myStep && (
        <>
          <Separator />
          <div className="rounded-lg border bg-card p-4 space-y-4 max-w-lg">
            <div>
              <p className="text-sm font-semibold text-foreground">Your Decision</p>
              <p className="text-xs text-muted-foreground">
                Step {myStep.stepOrder} — {myStep.canonicalRole}
              </p>
            </div>

            {!showReject ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Comments (optional)</Label>
                  <Textarea
                    rows={2}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    placeholder="Add a note for the organizer..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleApprove} disabled={approving} className="min-w-28">
                    {approving ? 'Approving...' : '✓ Approve'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowReject(true)}
                  >
                    ✗ Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>
                    Rejection Reason *
                    <span className="text-xs text-muted-foreground ml-1">
                      (min 5 characters)
                    </span>
                  </Label>
                  <Textarea
                    rows={3}
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Explain why this event is being rejected..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={rejectReason.trim().length < 5 || rejecting}
                  >
                    {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => { setShowReject(false); setRejectReason('') }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Approver but not their turn */}
      {isApprover && !myStep && steps.some(s => s.status === 'PENDING') && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            This event is at a different step. Waiting for another reviewer before it reaches you.
          </p>
        </div>
      )}
    </div>
  )
}