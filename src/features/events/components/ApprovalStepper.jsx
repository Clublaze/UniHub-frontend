// All step colors come from theme.js — no color classes written here
import { stepDotClass, stepRowClass, getStepStyleKey } from '../../../styles/theme'
import { formatDate } from '../../../utils/date.util'

export default function ApprovalStepper({ steps = [] }) {
  const sorted = [...steps].sort((a, b) => a.stepOrder - b.stepOrder)

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This event has not been submitted yet. No approval steps exist.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {sorted.map((step) => {
        const key = getStepStyleKey(step)

        return (
          <div key={step._id} className={`rounded-md p-4 ${stepRowClass[key]}`}>
            <div className="flex items-start gap-4">

              {/* Status dot — color comes from stepDotClass in theme.js */}
              <div className="mt-1 shrink-0">
                <div className={`h-3.5 w-3.5 rounded-full ${stepDotClass[key]}`} />
              </div>

              {/* Step details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Step {step.stepOrder} — {step.canonicalRole}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {/* assignedToName is already resolved by backend */}
                      {step.assignedToName || step.assignedTo}
                    </p>
                  </div>

                  <div className="text-right text-xs text-muted-foreground">
                    {step.status === 'PENDING' && step.isActive  && 'Waiting for action...'}
                    {step.status === 'PENDING' && !step.isActive && 'Not yet reached'}
                    {step.status === 'APPROVED' && step.actedAt  && formatDate(step.actedAt)}
                    {step.status === 'REJECTED' && step.actedAt  && formatDate(step.actedAt)}
                    {step.status === 'SKIPPED'                   && 'Skipped'}
                    {step.actedByName && step.status !== 'PENDING' && (
                      <p>by {step.actedByName}</p>
                    )}
                  </div>
                </div>

                {/* Approver comments or rejection reason */}
                {step.comments && (
                  <p className="mt-1.5 text-xs text-muted-foreground italic">
                    "{step.comments}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}