// Gracefully handles org tree 500 (empty db).
// Shows truncated userId in recent activity since audit log has no name resolution.
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getAuditFeedApi, getOrgTreeApi, getAdminUsersApi } from '../../audit/audit.api'
import Loader from '../../../components/shared/Loader'
import { Button } from '../../../components/ui/button'
import { timeAgo } from '../../../utils/date.util'

// Flatten tree and count by type — safe against empty/error tree
function countOrgNodes(tree = []) {
  let clubs = 0, societies = 0
  const walk = (nodes) => {
    if (!Array.isArray(nodes)) return
    nodes.forEach(node => {
      if (node.type === 'CLUB')    clubs++
      if (node.type === 'SOCIETY') societies++
      if (node.children?.length)   walk(node.children)
    })
  }
  walk(tree)
  return { clubs, societies }
}

const ACTION_LABEL = {
  EVENT_SUBMITTED:  'submitted an event',
  EVENT_APPROVED:   'event approved',
  STEP_APPROVED:    'approved a step',
  STEP_REJECTED:    'rejected a step',
  ROLE_ASSIGNED:    'role assigned',
  BUDGET_APPROVED:  'budget approved',
  BUDGET_SUBMITTED: 'submitted a budget',
  ECR_SUBMITTED:    'submitted ECR',
  MEMBERSHIP_APPROVED: 'membership approved',
  MEMBERSHIP_REJECTED: 'membership rejected',
  EVENT_CREATED:    'created an event',
  EVENT_REJECTED:   'event rejected',
}

// Show last 6 chars of a userId — enough to differentiate, not overwhelming
function shortId(id) {
  if (!id) return 'System'
  return `User …${id.slice(-6)}`
}

export default function AdminOverviewWidget() {

  const { data: auditData, isLoading: loadingAudit } = useQuery({
    queryKey: ['audit', 'feed', { limit: 5 }],
    queryFn:  () => getAuditFeedApi({ limit: 5 }),
    select:   (res) => res.data.data?.logs ?? [],
    staleTime: 1000 * 60,
    retry: false,
  })

  // Org tree — retry:false so a 500 (empty DB) doesn't retry 3x and block the widget
  const { data: treeData } = useQuery({
    queryKey: ['org', 'tree'],
    queryFn:  () => getOrgTreeApi(),
    select:   (res) => res.data.data ?? [],
    staleTime: 1000 * 60 * 10,
    retry: false,
    // Silently handle 500 — org tree just not set up yet
  })

  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users', { limit: 1 }],
    queryFn:  () => getAdminUsersApi({ limit: 1 }),
    select:   (res) => res.data.data,
    staleTime: 1000 * 60 * 10,
    retry: false,
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
            <p className="text-xs text-muted-foreground">No recent activity yet.</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log, i) => (
                <div
                  key={log._id || i}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">
                    <span
                      className="font-medium text-foreground"
                      title={log.performedBy}
                    >
                      {shortId(log.performedBy)}
                    </span>
                    {' '}
                    {ACTION_LABEL[log.action] || log.action?.toLowerCase().replace(/_/g, ' ')}
                  </span>
                  <span className="text-muted-foreground shrink-0 ml-2">
                    {log.timestamp ? timeAgo(log.timestamp) : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Useful info when clubs/societies are 0 */}
        {clubs === 0 && (
          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            No clubs or societies found yet. Go to{' '}
            <Link to="/admin/organizations" className="text-primary hover:underline">
              Org Tree
            </Link>{' '}
            to create the university structure.
          </div>
        )}

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