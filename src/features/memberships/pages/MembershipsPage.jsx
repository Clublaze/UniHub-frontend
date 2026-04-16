// Full memberships page — shows all the user's club memberships with actions.
// Status colors come from StatusBadge → theme.js (membershipBadgeClass)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ExternalLink } from 'lucide-react'
import {
  getMyMembershipsApi,
  applyToClubApi,
  leaveClubApi,
} from '../../../features/memberships/memberships.api'
import StatusBadge from '../../../components/shared/StatusBadge'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { formatDate } from '../../../utils/date.util'

export default function MembershipsPage() {
  const qc = useQueryClient()

  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ['memberships', 'my'],
    queryFn:  () => getMyMembershipsApi().then(r => r.data.data ?? []),
    staleTime: 1000 * 60 * 2,
  })

  const leaveMutation = useMutation({
    mutationFn: (clubId) => leaveClubApi(clubId),
    onSuccess:  () => {
      toast.success('You have left the club.')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: () => toast.error('Failed to leave club.'),
  })

  const applyMutation = useMutation({
    mutationFn: (clubId) => applyToClubApi({ clubId, applicationNote: '' }),
    onSuccess:  () => {
      toast.success('Application submitted!')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to apply.'),
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Memberships</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All clubs you have applied to or joined
        </p>
      </div>

      {isLoading ? (
        <Loader text="Loading memberships..." />
      ) : memberships.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            You haven't joined any clubs yet.
          </p>
          <Link to="/clubs">
            <Button size="sm">Browse Clubs</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['Club', 'Status', 'Applied', 'Updated', ''].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-medium text-muted-foreground text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {memberships.map((m, i) => (
                <tr key={m.clubId || i} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {m.clubName || m.clubId}
                      </p>
                      <Link
                        to={`/clubs/${m.clubId}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} type="membership" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.appliedAt ? formatDate(m.appliedAt) : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.status === 'ACTIVE'   && m.approvedAt  ? formatDate(m.approvedAt)  : ''}
                    {m.status === 'REJECTED' && m.rejectedAt  ? formatDate(m.rejectedAt)  : ''}
                    {m.status === 'LEFT'     && m.leftAt      ? formatDate(m.leftAt)       : ''}
                    {m.status === 'PENDING'  ? '—' : ''}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => leaveMutation.mutate(m.clubId)}
                        disabled={leaveMutation.isPending}
                      >
                        Leave
                      </Button>
                    )}
                    {(m.status === 'REJECTED' || m.status === 'LEFT') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applyMutation.mutate(m.clubId)}
                        disabled={applyMutation.isPending}
                      >
                        {m.status === 'LEFT' ? 'Rejoin' : 'Apply Again'}
                      </Button>
                    )}
                    {m.status === 'PENDING' && (
                      <span className="text-xs text-muted-foreground">
                        Awaiting review
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {memberships.length > 0 && (
        <div className="text-center">
          <Link to="/clubs">
            <Button variant="outline" size="sm">Browse More Clubs</Button>
          </Link>
        </div>
      )}
    </div>
  )
}