// Only shown to STUDENT userType
// Shows their membership status across all clubs with action buttons
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import {
  getMyMembershipsApi, applyToClubApi, leaveClubApi,
} from '../../memberships/memberships.api'
import StatusBadge from '../../../components/shared/StatusBadge'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { formatDate } from '../../../utils/date.util'

export default function MyMembershipsWidget() {
  const qc = useQueryClient()

  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ['memberships', 'my'],
    queryFn:  () => getMyMembershipsApi().then(r => r.data.data ?? []),
    staleTime: 1000 * 60 * 2,
  })

  const leaveMutation = useMutation({
    mutationFn: (clubId) => leaveClubApi(clubId),
    onSuccess:  () => {
      toast.success('Left club successfully.')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: () => toast.error('Could not leave club.'),
  })

  const reapplyMutation = useMutation({
    mutationFn: (clubId) => applyToClubApi({ clubId, applicationNote: '' }),
    onSuccess:  () => {
      toast.success('Application submitted!')
      qc.invalidateQueries({ queryKey: ['memberships', 'my'] })
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to apply.'),
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">My Club Memberships</h2>
        <Link to="/memberships">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View All →
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : memberships.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              You haven't joined any clubs yet.
            </p>
            <Link to="/explore/clubs">
              <Button size="sm">Browse Clubs</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Club</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">Applied</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {memberships.map((m, i) => (
                <tr key={m.clubId || i} className="border-t">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {m.clubName || m.clubId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} type="membership" />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {m.appliedAt ? formatDate(m.appliedAt) : '—'}
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
                        onClick={() => reapplyMutation.mutate(m.clubId)}
                        disabled={reapplyMutation.isPending}
                      >
                        Apply Again
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}