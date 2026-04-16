// Co-lead: can see + manage pending members, but cannot create/submit events
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Users, Check, X } from 'lucide-react'
import {
  getPendingMembershipsApi,
  approveMembershipApi,
  rejectMembershipApi,
} from '../../memberships/memberships.api'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { formatDate } from '../../../utils/date.util'

export default function CoLeadPanel({ clubId, clubName }) {
  const qc = useQueryClient()

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['memberships', 'pending', clubId],
    queryFn:  () =>
      getPendingMembershipsApi(clubId).then(r => {
        const d = r.data.data
        return Array.isArray(d) ? d : (d?.data ?? [])
      }),
  })

  const approveMutation = useMutation({
    mutationFn: (id) => approveMembershipApi(id),
    onSuccess:  () => {
      toast.success('Membership approved.')
      qc.invalidateQueries({ queryKey: ['memberships', 'pending', clubId] })
    },
    onError: () => toast.error('Failed to approve.'),
  })

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectMembershipApi(id, 'Rejected from dashboard'),
    onSuccess:  () => {
      toast.success('Membership rejected.')
      qc.invalidateQueries({ queryKey: ['memberships', 'pending', clubId] })
    },
    onError: () => toast.error('Failed to reject.'),
  })

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h2 className="font-semibold text-foreground">{clubName}</h2>
          <p className="text-xs text-muted-foreground">Co-Lead</p>
        </div>
        <Link to={`/clubs/${clubId}/members`}>
          <Button size="sm" variant="outline">
            <Users className="h-4 w-4 mr-1" />
            All Members
          </Button>
        </Link>
      </div>

      <div className="p-4">
        <p className="text-sm font-medium text-foreground mb-3">
          Pending Applications
          {pending.length > 0 && (
            <span className="ml-2 text-muted-foreground">({pending.length})</span>
          )}
        </p>

        {isLoading ? (
          <Loader size="sm" />
        ) : pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending applications.
          </p>
        ) : (
          <div className="space-y-2">
            {pending.map(m => (
              <div
                key={m._id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {m.userName || m.userId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Applied {formatDate(m.appliedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm" variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50"
                    onClick={() => approveMutation.mutate(m._id)}
                    disabled={approveMutation.isPending}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive/5"
                    onClick={() => rejectMutation.mutate(m._id)}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}