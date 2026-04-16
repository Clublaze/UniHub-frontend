// Only shown to UNIVERSITY_ADMIN / ADMIN / SUPER_ADMIN
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAuditFeedApi, getOrgTreeApi, getAdminUsersApi } from '../../audit/audit.api'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { timeAgo } from '../../../utils/date.util'

// Flatten the org tree and count by type
function countOrgNodes(tree = []) {
  let clubs = 0, societies = 0
  const walk = (nodes) => {
    nodes.forEach(node => {
      if (node.type === 'CLUB')    clubs++
      if (node.type === 'SOCIETY') societies++
      if (node.children?.length)  walk(node.children)
    })
  }
  walk(tree)
  return { clubs, societies }
}

// Format an audit action code into a human-readable sentence
function formatAction(log) {
  const map = {
    EVENT_SUBMITTED:   'submitted an event',
    EVENT_APPROVED:    'event approved',
    STEP_APPROVED:     'approved a step',
    STEP_REJECTED:     'rejected a step',
    ROLE_ASSIGNED:     'assigned a role',
    BUDGET_APPROVED:   'budget approved',
    ECR_SUBMITTED:     'submitted ECR',
    MEMBERSHIP_APPROVED: 'membership approved',
  }
  return map[log.action] || log.action
}

export default function AdminOverviewWidget() {
  const { data: auditData, isLoading: loadingAudit } = useQuery({
    queryKey: ['audit', 'feed', { limit: 5 }],
    queryFn:  () => getAuditFeedApi({ limit: 5 }).then(r => r.data.data?.logs ?? []),
    staleTime: 1000 * 60,
  })

  const { data: treeData } = useQuery({
    queryKey: ['org', 'tree'],
    queryFn:  () => getOrgTreeApi().then(r => r.data.data ?? []),
    staleTime: 1000 * 60 * 10,
  })

  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users', { limit: 1 }],
    queryFn:  () => getAdminUsersApi({ limit: 1 }).then(r => r.data.data),
    staleTime: 1000 * 60 * 10,
  })

  const recentLogs = auditData ?? []
  const { clubs, societies } = countOrgNodes(treeData)
  const totalUsers = usersData?.total ?? '—'

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">University Overview</h2>

      <div className="rounded-lg border bg-card p-5 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{clubs}</p>
            <p className="text-xs text-muted-foreground">Active Clubs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{societies}</p>
            <p className="text-xs text-muted-foreground">Societies</p>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Recent Activity</p>
          {loadingAudit ? (
            <Loader size="sm" />
          ) : recentLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No recent activity.</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <div key={log._id || i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {log.performedBy}
                    </span>{' '}
                    {formatAction(log)}
                  </span>
                  <span className="text-muted-foreground shrink-0 ml-2">
                    {timeAgo(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action links */}
        <div className="flex gap-2 flex-wrap">
          <Link to="/audit">
            <Button size="sm" variant="outline">Full Audit</Button>
          </Link>
          <Link to="/admin/users">
            <Button size="sm" variant="outline">Manage Users</Button>
          </Link>
          <Link to="/admin/organizations">
            <Button size="sm" variant="outline">Org Tree</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}