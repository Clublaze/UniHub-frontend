// Status colors come from StatusBadge → theme.js via membershipBadgeClass
import { useState } from 'react'
import { Check, X } from 'lucide-react'
import {
  useClubMembers, usePendingMembers,
  useApproveMember, useRejectMember,
} from '../hooks/useClubs'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { Label } from '../../../components/ui/label'
import { actionButtonClass } from '../../../styles/theme'
import { formatDate } from '../../../utils/date.util'

// Reject dialog shown inline below the row being rejected
function RejectInline({ membershipId, onCancel, clubId }) {
  const [reason, setReason] = useState('')
  const { mutate: reject, isPending } = useRejectMember(clubId)

  return (
    <div className="p-3 border-t bg-muted/30 space-y-2">
      <Label className="text-xs">Rejection reason</Label>
      <Textarea
        rows={2}
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Why is this application being rejected?"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="destructive"
          disabled={!reason.trim() || isPending}
          onClick={() => reject({ id: membershipId, reason: reason.trim() })}
        >
          {isPending ? 'Rejecting...' : 'Confirm'}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

export default function MembersTab({ clubId }) {
  const { data: pending = [], isLoading: loadingPending } = usePendingMembers(clubId)
  const { data: members = [], isLoading: loadingMembers } = useClubMembers(clubId)
  const { mutate: approve, isPending: approving }         = useApproveMember(clubId)

  const [rejectingId, setRejectingId] = useState(null)

  return (
    <div className="space-y-8">

      {/* Pending Applications */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Pending Applications
          {pending.length > 0 && (
            <span className="ml-2 text-muted-foreground font-normal">
              ({pending.length})
            </span>
          )}
        </h3>

        {loadingPending ? (
          <Loader size="sm" />
        ) : pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending applications.
          </p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            {pending.map(m => (
              <div key={m._id} className="border-b last:border-b-0">
                <div className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {m.userName || m.userId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied {m.appliedAt ? formatDate(m.appliedAt) : '—'}
                    </p>
                    {m.applicationNote && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">
                        "{m.applicationNote}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className={actionButtonClass.approve}
                      onClick={() => approve(m._id)}
                      disabled={approving}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={actionButtonClass.reject}
                      onClick={() =>
                        setRejectingId(rejectingId === m._id ? null : m._id)
                      }
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
                {rejectingId === m._id && (
                  <RejectInline
                    membershipId={m._id}
                    clubId={clubId}
                    onCancel={() => setRejectingId(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Members */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Active Members
          {members.length > 0 && (
            <span className="ml-2 text-muted-foreground font-normal">
              ({members.length})
            </span>
          )}
        </h3>

        {loadingMembers ? (
          <Loader size="sm" />
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active members yet.</p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Name', 'Joined'].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m._id} className="border-t">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {m.userName || m.userId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {m.approvedAt ? formatDate(m.approvedAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
